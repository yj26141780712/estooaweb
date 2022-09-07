import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeAboutComponent } from './home-about/home-about.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      {
        path: 'workplace',
        component: HomeAboutComponent,
        data: {
          title: '数据中心'
        },
      },
      {
        path: 'system',
        loadChildren: () => import('./system/system.module').then(m => m.SystemModule)
      },
      {
        path: 'baseinfo',
        loadChildren: () => import('./baseinfo/baseinfo.module').then(m => m.BaseinfoModule)
      },
      {
        path: 'hospital',
        loadChildren: () => import('./hospital/hospital.module').then(m => m.HospitalModule)
      },
      {
        path: 'general',
        loadChildren: () => import('./general/general.module').then(m => m.GeneralModule)
      },
      {
        path: 'device',
        loadChildren: () => import('./device/device.module').then(m => m.DeviceModule)
      },
      {
        path: 'shop',
        loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
