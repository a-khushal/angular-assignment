import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { JsonPipe, NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, JsonPipe, NgIf, NgFor],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  message = 'Upload a JSON file';
  data: any[] = [];
  headers: string[] = [];

  currentPage = 1;
  entriesPerPage = 10;

  get totalPages(): number {
    return Math.ceil(this.data.length / this.entriesPerPage);
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    return this.data.slice(start, start + this.entriesPerPage);
  }

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
}
