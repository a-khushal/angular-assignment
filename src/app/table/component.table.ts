import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, JsonPipe, NgIf, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

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
    NgIf,
    NgFor
  ],
  templateUrl: './component.table.html',
  styleUrls: ['./component.table.css'],
})
export class Table {
  message = 'Upload a JSON file';
  data: any[] = [];
  headers: string[] = [];

  searchQuery = '';
  currentPage = 1;
  entriesPerPage = 10;

  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      console.log('File selected:', file.name);
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
            this.message = 'Expected an array of objects or an array with data';
          }
        } catch (err) {
          console.error('Error parsing JSON:', err);
          this.data = [];
          this.headers = [];
          this.message = 'Invalid JSON';
        }
      };

      reader.readAsText(file);
    } else {
      this.message = 'Please upload a .json file';
    }
  }

  onSearchChange() {
    this.currentPage = 1; // reset to first page on search
  }

  get filteredData(): any[] {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.paginatedData;

    const filtered = this.data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );

    const start = (this.currentPage - 1) * this.entriesPerPage;
    return filtered.slice(start, start + this.entriesPerPage);
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    return this.data.slice(start, start + this.entriesPerPage);
  }

  get totalPages(): number {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return Math.ceil(this.data.length / this.entriesPerPage);

    const filteredLength = this.data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    ).length;

    return Math.ceil(filteredLength / this.entriesPerPage);
  }

  get totalPagesArray(): undefined[] {
    return Array(this.totalPages);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  setHoverColor(event: Event, color: string) {
    const target = event.currentTarget as HTMLElement;
    target.style.backgroundColor = color;
  }
}
