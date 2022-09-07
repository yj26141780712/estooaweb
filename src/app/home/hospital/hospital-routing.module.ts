import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocterComponent } from './docter/docter.component';
import { HospitalMComponent } from './hospital-m/hospital-m.component';
import { HospitalComponent } from './hospital.component';
import { PatientComponent } from './patient/patient.component';

const routes: Routes = [{
  path: '',
  component: HospitalComponent,
  children: [
    {
      path: 'hospitalM',
      component: HospitalMComponent
    },
    {
      path: 'docter',
      component: DocterComponent
    },
    {
      path: 'patient',
      component: PatientComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HospitalRoutingModule { }
