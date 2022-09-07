import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop.component';
import { ProductComponent } from './product/product.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { UploadModalModule } from 'src/app/components/upload-modal/upload-modal.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { DispatchComponent } from './dispatch/dispatch.component';
import { ExpressComponent } from './express/express.component';
import { StoreComponent } from './store/store.component';
import { DeviceComponent } from './device/device.component';
import { ProductRentPriceFormComponent } from './product-rent-price-form/product-rent-price-form.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { DispatchFormComponent } from './dispatch-form/dispatch-form.component';
import { AreaSelectModule } from 'src/app/components/area-select/area-select.module';
import { DispatchStoreFormComponent } from './dispatch-store-form/dispatch-store-form.component';
import { DispatchSelfetchFormComponent } from './dispatch-selfetch-form/dispatch-selfetch-form.component';
import { StoreFormComponent } from './store-form/store-form.component';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { ExpressFormComponent } from './express-form/express-form.component';
import { ProductUpdateFormComponent } from './product-update-form/product-update-form.component';
import { ProductDispatchFormComponent } from './product-dispatch-form/product-dispatch-form.component';
import { SearchModalModule } from 'src/app/components/search-modal/search-modal.module';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { OrderComponent } from './order/order.component';
import { StoreDeviceComponent } from './store-device/store-device.component';
import { DatePickerModule } from 'src/app/components/date-picker/date-picker.module';
import { OrderSendComponent } from './order-send/order-send.component';
import { CsManagerComponent } from './cs-manager/cs-manager.component';
import { CsManagerFormComponent } from './cs-manager-form/cs-manager-form.component';
import { OrderOperationComponent } from './order-operation/order-operation.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzStepsModule } from 'ng-zorro-antd/steps';

@NgModule({
  declarations: [
    ShopComponent,
    ProductComponent,
    ProductFormComponent,
    DispatchComponent,
    ExpressComponent,
    StoreComponent,
    DeviceComponent,
    ProductRentPriceFormComponent,
    DispatchFormComponent,
    DispatchStoreFormComponent,
    DispatchSelfetchFormComponent,
    StoreFormComponent,
    ExpressFormComponent,
    ProductUpdateFormComponent,
    ProductDispatchFormComponent,
    OrderComponent,
    StoreDeviceComponent,
    OrderSendComponent,
    CsManagerComponent,
    CsManagerFormComponent,
    OrderOperationComponent,
    OrderDetailComponent
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzGridModule,
    NzSpaceModule,
    NzDropDownModule,
    NzPopoverModule,
    NzCheckboxModule,
    NzIconModule,
    NzTableModule,
    NzImageModule,
    NzUploadModule,
    NzButtonModule,
    NzInputModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    UploadModalModule,
    NzToolTipModule,
    NzRadioModule,
    NzInputNumberModule,
    NzTabsModule,
    AreaSelectModule,
    NzCascaderModule,
    NzTimePickerModule,
    SearchModalModule,
    NzTagModule,
    DatePickerModule,
    NzListModule,
    NzStepsModule
  ]
})
export class ShopModule { }
