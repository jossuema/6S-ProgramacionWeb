import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-csv',
  templateUrl: './csv.component.html',
  styleUrl: './csv.component.css'
})
export class CsvComponent {
  selectedFile: File | null = null;
  isLoaded = false;

  constructor(private apiService: ApiService) {}

  exportCsv(): void {
    this.isLoaded = true;
    this.apiService.exportCsv().subscribe(
      data => {
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        this.isLoaded = false;
        window.open(url);
      },
      error => {
        this.isLoaded = false;
        console.error('Error al exportar CSV:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadCsv(): void {
    this.isLoaded = true;
    if (this.selectedFile) {
      this.apiService.uploadCsv(this.selectedFile).subscribe(
        data => {
          this.isLoaded = false;
          console.log('CSV subido correctamente:', data);
        },
        error => {
          this.isLoaded = false;
          console.error('Error al subir CSV:', error);
        }
      );
    }
  }
}
