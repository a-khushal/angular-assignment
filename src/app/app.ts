import { CommonModule } from "@angular/common";
import { Table } from "./table/component.table";
import { Component } from "@angular/core";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    Table,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class App {
  title = 'JSON Table Viewer';
  description = 'Upload a JSON file to view its contents in a table format.';
  instructions = 'Click the button below to upload a JSON file.';
  uploadButtonLabel = 'Upload JSON File';
}