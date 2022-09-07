import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { MenuComponent } from './menu/menu.component';
import { RoleComponent } from './role/role.component';
import { SystemComponent } from './system.component';

const routes: Routes = [
  {
    path: '',
    component: SystemComponent,
    children: [
      {
        path: 'menu',
        component: MenuComponent
      },
      {
        path: 'account',
        component: AccountComponent
      },
      {
        path: 'role',
        component: RoleComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
