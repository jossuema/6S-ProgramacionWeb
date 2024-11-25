import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiurl = 'http://localhost:3000'; // Cambia a la URL correcta del backend

  constructor(private http: HttpClient) {}

  // Método para exportar los datos a CSV
  exportCsv(): Observable<Blob> {
    return this.http.get(`${this.apiurl}/export`, { responseType: 'blob' })
      .pipe(
        catchError(error => {
          console.error('Error al exportar CSV:', error);
          return throwError(error);
        })
      );
  }

  // Método para importar datos desde un archivo CSV
  uploadCsv(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiurl}/upload`, formData)
      .pipe(
        catchError(error => {
          console.error('Error al subir CSV:', error);
          return throwError(error);
        })
      );
  }
}