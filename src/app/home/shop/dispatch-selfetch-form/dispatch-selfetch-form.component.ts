import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { catchError, of, map } from 'rxjs';
import { Dispatch, ShopService } from 'src/app/api/shop.service';
import { SearchModalService } from 'src/app/components/search-modal/search-modal.service';

@Component({
  selector: 'app-dispatch-selfetch-form',
  templateUrl: './dispatch-selfetch-form.component.html',
  styleUrls: ['./dispatch-selfetch-form.component.scss']
})
export class DispatchSelfetchFormComponent implements OnInit {

  type = Dispatch.selfetch.toString();
  isEdit = false;
  item: any;
  formGroup!: FormGroup;
  tags: Array<{ id: number, name: string }> = [];
  loading = false;
  constructor(private fb: FormBuilder,
    private modalRef: NzModalRef,
    private messageService: NzMessageService,
    private searchModalService: SearchModalService,
    private shopService: ShopService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: [null, Validators.required]
    });
    if (this.item) {
      for (const key in this.formGroup.controls) {
        this.formGroup.controls[key].setValue(this.item[key]);
      }
      if (this.item[this.type]) {
        const ids: number[] = this.item[this.type].storeIds.split(',').map((x: any) => Number(x));
        const names: string[] = this.item[this.type].storeNames.split(',');
        this.tags = ids.map((v, i: number) => {
          return { id: v, name: names[i] };
        });
      }
    }
  }

  onClose(index: number) {
    this.tags.splice(index, 1);
  }

  selectStore(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.searchModalService.openSelect({
      callback: this.callback,
      dataLoading: this.getStoreList,
      searchItems: [
        { key: 'name', label: '门店名称' }
      ],
      tableItems: [
        { key: 'name', title: '门店名称', checked: true, },
        {
          key: 'address', title: '门店地址', checked: true,
          change: (value, key, item) => `${item.provinceName}${item.cityName}${item.areaName}${item.address}`
        },
        { key: 'realname', title: '联系人', checked: true, },
        { key: 'phone', title: '联系电话', checked: true, },
        { key: 'openHours', title: '营业时间', checked: true, },
      ],
      multiple: true,
      checkIds: this.tags.map(x => x.id)
    });
  }

  callback = (items: any) => {
    this.tags = items.map((x: any) => {
      return { id: x.id, name: x.name };
    });
  }

  getStoreList = (obj: any) => {
    return this.shopService.getStoreList({
      obj,
      store: '1'
    }).pipe(
      catchError(err => of([])),
      map(x => {
        return x.code === 200 ? x.data : []
      }));
  }

  cancel() {
    this.modalRef.destroy();
  }

  submitForm() {
    for (const key in this.formGroup.controls) {
      this.formGroup.controls[key].markAsDirty();
      this.formGroup.controls[key].updateValueAndValidity();
    }
    if (this.formGroup.invalid) {
      return;
    }
    if (this.tags.length === 0) {
      this.messageService.error('请选择门店！');
      return;
    }
    this.loading = true;
    const obj: any = {
      ...this.formGroup.value,
      selfetch: {},
      type: this.type
    }
    obj.selfetch.storeIds = this.tags.map(x => x.id).join(',');
    obj.selfetch.storeNames = this.tags.map(x => x.name).join(',');
    if (this.item) {
      this.shopService.updateDispatchById(this.type, obj, this.item.id)
        .subscribe(json => {
          if (json.code === 200) {
            this.messageService.success('操作成功！');
            this.modalRef.destroy();
            this.shopService.refreshDispatchList(this.type);
          }
          this.loading = false;
        });
    } else {
      this.shopService.createDispatch(this.type, obj)
        .subscribe(json => {
          if (json.code === 200) {
            this.messageService.success('操作成功！');
            this.modalRef.destroy();
            this.shopService.refreshDispatchList(this.type);
          }
          this.loading = false;
        });
    }
  }
}
