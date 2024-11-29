import { Component } from '@angular/core';
import { HrService } from '../../services/hr.service';
import { Employee, Department, Job } from '../../services/hr.service';
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
  displayedColumns: string[] = ['id', 'Nombre', 'Apellido', 'Email', 'Celular', 'Fecha de contrato', 'job_id', 'Salario', 'Porcentaje comision', 'Nombre Manager', 'Nombre departamento', 'acciones'];
  registros = new MatTableDataSource<Employee>();
  employeeForm: FormGroup;
  editMode = false;
  empleadoActual: Employee | null = null;
  isLoading: boolean = false;
  currentAction: 'import' | 'export' | null = null;
  managers: Employee[] = [];
  departments: Department[] = [];
  jobs: Job[] = [];

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
    // Obtener empleados
    this.hrService.getEmployees().subscribe((employees: Employee[]) => {
      // Obtener departamentos
      this.hrService.getDepartments().subscribe((departments: Department[]) => {
        this.departments = departments;
        this.managers = employees;

        employees.forEach(employee => {
          const department = departments.find(d => d.department_id === employee.department_id);
          employee['department_name'] = department ? department.department_name : 'N/A';
        });
      });

      // Obtener managers
      this.hrService.getEmployees().subscribe((managers: Employee[]) => {
        employees.forEach(employee => {
          const manager = managers.find(m => m.employee_id === employee.manager_id);
          employee['manager_name'] = manager
            ? `${manager.first_name} ${manager.last_name}`
            : 'N/A';
        });
      });

      // Obtener trabajos
      this.hrService.getJobs().subscribe((jobs: Job[]) => {
        this.jobs = jobs;

        employees.forEach(employee => {
          const job = jobs.find(j => j.job_id === employee.job_id);
          employee['job_id'] = job ? job.job_title : 'N/A';
        });
      });
      
      this.registros.data = employees;
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
    this.employeeForm.get('hire_date')?.setValue(new Date(element.hire_date));
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

  exportarEmpleados() {
    this.isLoading = true; // Activar carga
    this.currentAction = 'export'; // Establecer acción actual
    this.hrService.exportEmployees().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employees.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al exportar:', err);
        alert('Error al exportar empleados');
      },
      complete: () => {
        this.isLoading = false; // Desactivar carga
        this.currentAction = null; // Resetear acción
      }
    });
  }  
  
  importarEmpleados(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.isLoading = true; // Activar carga
      this.currentAction = 'import'; // Establecer acción actual
      this.hrService.importEmployees(file).subscribe({
        next: () => {
          alert('Empleados importados exitosamente');
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Error al importar:', err);
          alert('Error al importar empleados');
        },
        complete: () => {
          this.isLoading = false; // Desactivar carga
          this.currentAction = null; // Resetear acción
        }
      });
    }
  }   
}
