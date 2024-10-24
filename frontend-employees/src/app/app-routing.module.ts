import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablaEmployeesComponent } from './components/tabla-employees/tabla-employees.component';

const routes: Routes = [
  { path: 'employees', component: TablaEmployeesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
