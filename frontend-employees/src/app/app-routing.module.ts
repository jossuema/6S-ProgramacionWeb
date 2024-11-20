import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablaEmployeesComponent } from './components/tabla-employees/tabla-employees.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  { path: 'employees', canActivate:[AuthGuard], component: TablaEmployeesComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}

