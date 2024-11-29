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

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(this.apiUrl + 'employees/' + id, {
      headers: this.getHeaders(),
    });
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl + 'departments', {
      headers: this.getHeaders(),
    });
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(this.apiUrl + 'departments/' + id, {
      headers: this.getHeaders(),
    });
  }

  exportEmployees(): Observable<any> {
    return this.http.get(this.apiUrl + 'employees/export', {
      headers: this.getHeaders(),
      responseType: 'blob',
    });
  }

  importEmployees(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiUrl + 'employees/import', formData, {
      headers: this.getHeaders().delete('Content-Type'),
    });
  }

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl + 'jobs', {
      headers: this.getHeaders(),
    });
  }

  getJobById(id: string): Observable<Job> {
    return this.http.get<Job>(this.apiUrl + 'jobs/' + id, {
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
  manager_name?: string;
  department_id: number;
  department_name?: string;
}

export interface Department {
  department_id: number;
  department_name: string;
  manager_id: number;
  location_id: number;
}

export interface Job{
  job_id: string;
  job_title: string;
  min_salary: number;
  max_salary: number;
}
