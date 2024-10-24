import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HrService {
  private apiUrl = 'http://localhost:3000/';

  constructor(private http:HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl + 'employees');
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(this.apiUrl + 'employees/' + id);
  }

  addEmployee(employee: Employee): Observable<any> {
    return this.http.post(this.apiUrl + 'employees', employee);
  }

  updateEmployee(employee: Employee): Observable<any> {
    return this.http.put(this.apiUrl + 'employees/' + employee.employee_id, employee);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + 'employees/' + id);
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
