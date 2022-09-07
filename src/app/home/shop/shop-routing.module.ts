import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CsManagerComponent } from './cs-manager/cs-manager.component';
import { DispatchComponent } from './dispatch/dispatch.component';
import { ExpressComponent } from './express/express.component';
import { OrderComponent } from './order/order.component';
import { ProductComponent } from './product/product.component';
import { ShopComponent } from './shop.component';
import { StoreDeviceComponent } from './store-device/store-device.component';
import { StoreComponent } from './store/store.component';

const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
    children: [
      {
        path: 'product',
        component: ProductComponent
      },
      {
        path: 'dispatch',
        component: DispatchComponent
      },
      {
        path: 'express',
        component: ExpressComponent
      },
      {
        path: 'store',
        component: StoreComponent
      },
      {
        path: 'storeDevice',
        component: StoreDeviceComponent
      },
      {
        path: 'order',
        component: OrderComponent
      },
      {
        path: 'cs',
        component: CsManagerComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
