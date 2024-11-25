import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CsvComponent } from './components/csv/csv.component';

const routes: Routes = [
  {'path': '', redirectTo: '/csv', pathMatch: 'full'},
  {'path': 'csv', component: CsvComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}

