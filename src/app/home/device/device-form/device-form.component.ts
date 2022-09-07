import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';
import { BaseinfoService } from 'src/app/api/baseinfo.service';
import { DeviceService } from 'src/app/api/device.service';
import { ShopService } from 'src/app/api/shop.service';
import { BaseForm } from '../../BaseForm';

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss']
})
export class DeviceFormComponent extends BaseForm implements OnInit, OnDestroy {

  isShowStore = false;
  models: any[] = [];
  useStatuss: any[] = [];
  stores: any[] = [];
  destroy$ = new Subject<void>();
  constructor(modalRef: NzModalRef,
    private fb: FormBuilder,
    private messageService: NzMessageService,
    private baseService: BaseinfoService,
    private shopService: ShopService,
    private deviceService: DeviceService) {
    super(modalRef);
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      modelId: [null, [Validators.required]],
      sn: ['', [Validators.required]],
    });
    if (this.isShowStore) {
      const storeControl = new FormControl(null, [Validators.required]);
      this.formGroup.addControl('storeId', storeControl);
    }
    if (this.item) {
      const useStatusControl = new FormControl(null, [Validators.required]);
      this.formGroup.addControl('useStatus', useStatusControl);
      for (const key in this.formGroup.value) {
        this.formGroup.controls[key].setValue(this.item[key]);
      }
    }
    this.deviceService.getModelList({})
      .pipe(takeUntil(this.destroy$))
      .subscribe((json) => {
        this.models = json.code === 200 ? json.data : [];
      });
    this.baseService.getDictDataListByTypeId(63)
      .pipe(takeUntil(this.destroy$))
      .subscribe(json => {
        this.useStatuss = json.code === 200 ? json.data : [];
      });
    this.shopService.getStoreList({})
      .pipe(takeUntil(this.destroy$))
      .subscribe(json => {
        this.stores = json.code === 200 ? json.data : [];
      });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm() {
    for (const key in this.formGroup.controls) {
      this.formGroup.controls[key].markAsDirty();
      this.formGroup.controls[key].updateValueAndValidity();
    }
    if (this.formGroup.invalid) {
      return;
    }
    this.loading = true;
    if (this.isEdit) {
      this.deviceService.updateDeviceById({
        ...this.formGroup.value
      }, this.item.id)
        .subscribe(json => {
          if (json.code === 200) {
            this.messageService.success('操作成功！');
            this.close();
            this.deviceService.refreshDeviceList();
          }
          this.loading = false;
        })
    } else {
      this.deviceService.createDevice({
        ...this.formGroup.value
      }).subscribe(json => {
        if (json.code === 200) {
          this.messageService.success('操作成功！');
          this.close();
          this.deviceService.refreshDeviceList();
        }
        this.loading = false;
      });
    }
  }
}
