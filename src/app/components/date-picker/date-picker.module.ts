import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerRangeComponent } from './date-picker-range/date-picker-range.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DatePickerRangeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NzDatePickerModule,
    NzInputModule,
    NzPopoverModule,
    NzDatePickerModule,
    NzIconModule
  ],
  exports: [
    DatePickerRangeComponent
  ]
})
export class DatePickerModule { }
