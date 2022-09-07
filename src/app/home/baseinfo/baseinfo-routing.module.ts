import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseinfoComponent } from './baseinfo.component';
import { DictDataComponent } from './dict-data/dict-data.component';
import { DictTypeComponent } from './dict-type/dict-type.component';

const routes: Routes = [
  {
    path: '',
    component: BaseinfoComponent,
    children: [
      {
        path: 'dictType',
        component: DictTypeComponent
      },
      {
        path: 'dictData',
        component: DictDataComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseinfoRoutingModule { }
