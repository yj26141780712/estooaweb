import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFormComponent } from './search-form/search-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { DatePickerModule } from '../date-picker/date-picker.module';
import { SearchModalService } from './search-modal.service';



@NgModule({
  declarations: [
    SearchFormComponent
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
    NzAlertModule,
    DatePickerModule
  ],
  providers: [
    SearchModalService
  ]
})
export class SearchModalModule { }
