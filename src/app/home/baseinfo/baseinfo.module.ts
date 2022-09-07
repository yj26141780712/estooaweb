import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseinfoRoutingModule } from './baseinfo-routing.module';
import { BaseinfoComponent } from './baseinfo.component';
import { DictTypeComponent } from './dict-type/dict-type.component';
import { DictDataComponent } from './dict-data/dict-data.component';
import { DictDataFormComponent } from './dict-data-form/dict-data-form.component';
import { DictTypeFormComponent } from './dict-type-form/dict-type-form.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzHighlightModule } from 'ng-zorro-antd/core/highlight';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { TreeViewModule } from 'src/app/components/tree-view/tree-view.module';
import { NzSelectModule } from 'ng-zorro-antd/select';

@NgModule({
  declarations: [
    BaseinfoComponent,
    DictTypeComponent,
    DictDataComponent,
    DictDataFormComponent,
    DictTypeFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BaseinfoRoutingModule,
    NzGridModule,
    NzFormModule,
    NzSpaceModule,
    NzDropDownModule,
    NzPopoverModule,
    NzIconModule,
    NzTableModule,
    NzCheckboxModule,
    NzInputModule,
    NzButtonModule,
    NzToolTipModule,
    NzModalModule,
    NzDividerModule,
    NzHighlightModule,
    NzSpinModule,
    TreeViewModule,
    NzSelectModule
  ]
})
export class BaseinfoModule { }
