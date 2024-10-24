import { Component } from '@angular/core';
import { HrService } from '../../services/hr.service';
import { Employee } from '../../services/hr.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-tabla-employees',
  templateUrl: './tabla-employees.component.html',
  styleUrl: './tabla-employees.component.css'
})
export class TablaEmployeesComponent {
  displayedColumns: string[] = ['id', 'Nombre', 'Apellido', 'Email', 'Celular', 'Fecha de contrato', 'job_id', 'Salario', 'Porcentaje comision', 'Id manager', 'Id departamento', 'acciones'];
  registros = new MatTableDataSource<Employee>();
  employeeForm: FormGroup;
  editMode = false;
  empleadoActual: Employee | null = null;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor(private hrService: HrService, private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      employee_id: [null],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      hire_date: ['', Validators.required],
      job_id: ['', Validators.required],
      salary: [0, Validators.required],
      commission_pct: [null],
      manager_id: [null],
      department_id: [null]
    });
  }

  ngOnInit() {
    this.hrService.getEmployees().subscribe((data: Employee[]) => {
      this.registros.data = data;
    });
  }

  ngAfterViewInit() {
    this.registros.paginator = this.paginator;
    this.registros.sort = this.sort;
  }

  onSubmit() {
    if (this.editMode) {
      this.actualizarEmpleado(this.employeeForm.value);
    } else {
      this.agregarEmpleado(this.employeeForm.value);
    }
  }

  agregarEmpleado(nuevoEmpleado: Employee) {
    this.hrService.addEmployee(nuevoEmpleado).subscribe((empleado: Employee) => {
      const updateData = [...this.registros.data, empleado];
      this.registros.data = updateData;
      this.employeeForm.reset();
    });
  }

  editarEmpleado(element: Employee) {
    this.editMode = true;
    this.empleadoActual = element;
    this.employeeForm.patchValue(element);
  }

  actualizarEmpleado(empleadoActualizado: Employee) {
    this.hrService.updateEmployee(empleadoActualizado).subscribe((empleado: Employee) => {
      const index = this.registros.data.findIndex(e => e.employee_id === this.empleadoActual?.employee_id);
      const updatedData = [...this.registros.data];
      updatedData[index] = empleado;
      this.registros.data = updatedData;
      this.resetFormulario();
    });
  }

  eliminarEmpleado(id: number) {
    this.hrService.deleteEmployee(id).subscribe(() => {
      const updatedData = this.registros.data.filter(registro => registro.employee_id !== id);
      this.registros.data = updatedData;
    });
  }

  resetFormulario() {
    this.editMode = false;
    this.empleadoActual = null;
    this.employeeForm.reset();
  }
}
