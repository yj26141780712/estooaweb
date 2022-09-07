import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page403Component } from './page403/page403.component';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';
import { ExceptionComponent } from './exception.component';
import { ExceptionRoutingModule } from './exception-routing.module';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';


@NgModule({
  declarations: [
    Page403Component,
    Page404Component,
    Page500Component,
    ExceptionComponent
  ],
  imports: [
    CommonModule,
    ExceptionRoutingModule,
    NzResultModule,
    NzButtonModule
  ]
})
export class ExceptionModule { }
