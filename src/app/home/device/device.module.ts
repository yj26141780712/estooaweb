import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceRoutingModule } from './device-routing.module';
import { DeviceComponent as DRoot } from './device.component';
import { DeviceComponent } from './device/device.component';
import { ModelComponent } from './model/model.component';
import { DataListComponent } from './data-list/data-list.component';
import { VideoListComponent } from './video-list/video-list.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ModelFormComponent } from './model-form/model-form.component';
import { DeviceFormComponent } from './device-form/device-form.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { DescriptionComponent } from './description/description.component';
import { DescriptionFormComponent } from './description-form/description-form.component';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { VideoFormComponent } from './video-form/video-form.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSelectModule } from 'ng-zorro-antd/select';


@NgModule({
  declarations: [
    DRoot,
    DeviceComponent,
    ModelComponent,
    DataListComponent,
    VideoListComponent,
    ModelFormComponent,
    DeviceFormComponent,
    DescriptionComponent,
    DescriptionFormComponent,
    VideoFormComponent
  ],
  imports: [
    CommonModule,
    DeviceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSpaceModule,
    NzDropDownModule,
    NzPopoverModule,
    NzIconModule,
    NzCheckboxModule,
    NzTableModule,
    NzInputModule,
    NzButtonModule,
    NzModalModule,
    NzImageModule,
    NzUploadModule,
    NzToolTipModule,
    NzSelectModule
  ]
})
export class DeviceModule { }
