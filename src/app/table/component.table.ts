import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelect, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormField,
    FormsModule,
    MatLabel,
    MatInputModule,
    MatCheckboxModule,
    MatCheckbox,
    MatSelect,
    MatSelectModule
  ],
  templateUrl: './component.table.html',
  styleUrls: ['./component.table.css'],
})
export class Table {
  message = 'Upload a JSON file';
  data: any[] = [];
  headers: string[] = [];
  selectedItems: Set<any> = new Set();
  searchQuery = '';
  currentPage = 1;
  entriesPerPage = 10;
  statusOptions = ['active', 'pending', 'inactive'];
  selectedStatus: string = 'active';

  constructor(private cdr: ChangeDetectorRef) {}

  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const result = reader.result as string;
          const json = JSON.parse(result);
          if (Array.isArray(json) && json.length > 0) {
            this.data = json;
            this.headers = Object.keys(json[0]);
            this.message = `Loaded ${json.length} items`;
            this.currentPage = 1;
            this.searchQuery = '';
          } else {
            this.data = [];
            this.headers = [];
            this.message = 'Expected an array of objects with data';
          }
        } catch (err) {
          console.error('Error parsing JSON:', err);
          this.data = [];
          this.headers = [];
          this.message = 'Invalid JSON';
        }
        this.cdr.detectChanges();
      };

      reader.readAsText(file);
    } else {
      this.message = 'Please upload a .json file';
    }
  }

  filteredData(): any[] {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.data;

    return this.data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
  }

  getPaginatedData(): any[] {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const data = this.filteredData().slice(start, start + this.entriesPerPage);
    console.log(data)
    return data;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData().length / this.entriesPerPage);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cdr.detectChanges();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cdr.detectChanges();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cdr.detectChanges();
    }
  }

  onSearchChange() {
    this.currentPage = 1;
  }

  toggleAll(checked: boolean) {
    this.getPaginatedData().forEach(item =>
      checked ? this.selectedItems.add(item) : this.selectedItems.delete(item)
    );
  }

  toggleOne(item: any, checked: boolean) {
    checked ? this.selectedItems.add(item) : this.selectedItems.delete(item);
  }

  isSelected(item: any): boolean {
    return this.selectedItems.has(item);
  }

  isAllSelected(): boolean {
    return this.getPaginatedData().every(item => this.selectedItems.has(item));
  }

  updateSelectedStatuses() {
    this.selectedItems.forEach(item => {
      item.status = this.selectedStatus;
    });
  }
}
