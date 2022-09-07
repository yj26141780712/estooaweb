import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HospitalRoutingModule } from './hospital-routing.module';
import { HospitalComponent } from './hospital.component';
import { DocterComponent } from './docter/docter.component';
import { PatientComponent } from './patient/patient.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { HospitalFormComponent } from './hospital-form/hospital-form.component';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzImageModule } from 'ng-zorro-antd/image';
import { HospitalMComponent } from './hospital-m/hospital-m.component';
import { DocterFormComponent } from './docter-form/docter-form.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  declarations: [
    HospitalMComponent,
    HospitalComponent,
    DocterComponent,
    PatientComponent,
    HospitalFormComponent,
    HospitalMComponent,
    DocterFormComponent
  ],
  imports: [
    CommonModule,
    HospitalRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NzGridModule,
    NzFormModule,
    NzTableModule,
    NzSpaceModule,
    NzDropDownModule,
    NzToolTipModule,
    NzPopoverModule,
    NzCheckboxModule,
    NzIconModule,
    NzModalModule,
    NzInputModule,
    NzButtonModule,
    NzCascaderModule,
    NzUploadModule,
    NzImageModule,
    NzSelectModule,
    NzSpinModule
  ]
})
export class HospitalModule { }
