import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemRoutingModule } from './system-routing.module';
import { SystemComponent } from './system.component';
import { MenuComponent } from './menu/menu.component';
import { MenuFormComponent } from './menu-form/menu-form.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { AccountComponent } from './account/account.component';
import { AccountFormComponent } from './account-form/account-form.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { TreeViewModule } from 'src/app/components/tree-view/tree-view.module';
import { NzHighlightModule } from 'ng-zorro-antd/core/highlight';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { RoleComponent } from './role/role.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { RolePermissionComponent } from './role-permission/role-permission.component';
import { NzTagModule } from 'ng-zorro-antd/tag';

@NgModule({
  declarations: [
    SystemComponent,
    MenuComponent,
    MenuFormComponent,
    AccountComponent,
    AccountFormComponent,
    RoleComponent,
    RoleFormComponent,
    RolePermissionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SystemRoutingModule,
    NzTableModule,
    NzGridModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzIconModule,
    NzToolTipModule,
    NzModalModule,
    NzSpaceModule,
    NzCheckboxModule,
    NzTreeSelectModule,
    NzDropDownModule,
    NzPopoverModule,
    NzTabsModule,
    NzSpinModule,
    TreeViewModule,
    NzHighlightModule,
    NzSelectModule,
    NzTagModule
  ]
})
export class SystemModule { }
