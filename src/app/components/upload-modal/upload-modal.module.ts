import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectFormComponent } from './select-form/select-form.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { UploadModalService } from './upload-modal.service';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { DatePickerModule } from '../date-picker/date-picker.module';
import { NzImageModule } from 'ng-zorro-antd/image';


@NgModule({
  declarations: [
    SelectFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule,
    NzTabsModule,
    NzDropDownModule,
    NzTableModule,
    NzIconModule,
    NzPopoverModule,
    NzCheckboxModule,
    NzButtonModule,
    NzSpaceModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzToolTipModule,
    NzUploadModule,
    NzAlertModule,
    DatePickerModule,
    NzImageModule
  ],
  providers: [
    UploadModalService
  ],
  exports: []
})
export class UploadModalModule { }
