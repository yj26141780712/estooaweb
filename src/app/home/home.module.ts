import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { HomeAboutComponent } from './home-about/home-about.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { SettingDrawerComponent } from './setting-drawer/setting-drawer.component';
import { TranslateModule } from '@ngx-translate/core';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { FormsModule } from '@angular/forms';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { TopMenuSubmenuComponent } from './top-menu-submenu/top-menu-submenu.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MessageBoxComponent } from './home-layout/message-box/message-box.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { DatePickerModule } from '../components/date-picker/date-picker.module';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { OverlayModule } from '@angular/cdk/overlay';
import { KefuModule } from '../components/kefu/kefu.module';

@NgModule({
  declarations: [
    HomeComponent,
    HomeAboutComponent,
    SettingDrawerComponent,
    TopMenuSubmenuComponent,
    MessageBoxComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    NzLayoutModule,
    NzSliderModule,
    NzMenuModule,
    NzIconModule,
    NzBreadCrumbModule,
    NzModalModule,
    NzDividerModule,
    NzDrawerModule,
    NzToolTipModule,
    NzListModule,
    NzSwitchModule,
    NzTabsModule,
    NzBadgeModule,
    NzAvatarModule,
    NzDropDownModule,
    NzButtonModule,
    NzListModule,
    NzGridModule,
    DatePickerModule,
    TranslateModule.forChild(),
    NzProgressModule,
    NzImageModule,
    NzEmptyModule,
    KefuModule
  ]
})
export class HomeModule { }
