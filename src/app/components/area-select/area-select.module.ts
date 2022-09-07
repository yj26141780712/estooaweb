import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaSelectComponent } from './area-select/area-select.component';
import { AreaSelectService } from './area-select.service';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { TreeViewModule } from '../tree-view/tree-view.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AreaSelectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NzCheckboxModule,
    NzInputModule,
    TreeViewModule
  ],
  providers: [
    AreaSelectService
  ]
})
export class AreaSelectModule { }
