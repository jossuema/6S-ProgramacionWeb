import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Servicio de autenticación

@Injectable({
  providedIn: 'root',
})
export class HrService {
  private apiUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl + 'employees', {
      headers: this.getHeaders(),
    });
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(this.apiUrl + 'employees/' + id, {
      headers: this.getHeaders(),
    });
  }

  addEmployee(employee: Employee): Observable<any> {
    return this.http.post(this.apiUrl + 'employees', employee, {
      headers: this.getHeaders(),
    });
  }

  updateEmployee(employee: Employee): Observable<any> {
    return this.http.put(this.apiUrl + 'employees/' + employee.employee_id, employee, {
      headers: this.getHeaders(),
    });
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + 'employees/' + id, {
      headers: this.getHeaders(),
    });
  }
}

export interface Employee {
  employee_id: number;
  first_name: string;
  last_name : string;
  email: string;
  phone_number: string;
  hire_date: string;
  job_id: string;
  salary: number;
  commission_pct: number;
  manager_id: number;
  department_id: number;
}
