import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ShopService } from 'src/app/api/shop.service';
import { AreaSelectService } from 'src/app/components/area-select/area-select.service';

@Component({
  selector: 'app-dispatch-form',
  templateUrl: './dispatch-form.component.html',
  styleUrls: ['./dispatch-form.component.scss']
})
export class DispatchFormComponent implements OnInit {

  type = 'express';
  isEdit = false;
  item: any;
  formGroup!: FormGroup;
  loading = false;
  items: any[] = [{ price: 0 }]
  selectItem: any;
  //list: any[] = [{ '动态变化字段': [{}] },{}]
  constructor(private fb: FormBuilder,
    private modalRef: NzModalRef,
    private areaSelectService: AreaSelectService,
    private messageService: NzMessageService,
    private shopService: ShopService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: [null, Validators.required]
    })
    if (this.item) {
      for (const key in this.formGroup.value) {
        this.formGroup.controls[key].setValue(this.item[key]);
      }
      if (this.item.express) {
        this.items = this.item.express.map((x: any) => {
          return {
            provinceIds: x.provinceIds,
            cityIds: x.cityIds,
            areaIds: x.areaIds,
            areaText: x.areaText,
            price: x.price
          };
        });
      }
    }
  }

  select(item: any, e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.selectItem = item;
    this.areaSelectService.openSelect(this.selectArea);
  }

  selectArea = (arr: any[]) => {
    const provinces = arr.filter(n => n.level === 0);
    const citys = arr.filter(n => n.level === 1);
    const areas = arr.filter(n => n.level === 2);
    this.selectItem.provinceIds = provinces.map(x => x.key).join(',');
    this.selectItem.cityIds = citys.map(x => x.key).join(',');
    this.selectItem.areaIds = areas.map(x => x.key).join(',');
    this.selectItem.areaText = arr.map(x => x.name).join(',');
  }

  delete(e: MouseEvent, i: number) {
    e.stopPropagation();
    e.preventDefault();
    this.items.splice(i, 1);
  }

  add(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.items.push({
      price: 0
    });
  }

  cancel() {

  }

  submitForm() {
    for (const key in this.formGroup.controls) {
      this.formGroup.controls[key].markAsDirty();
      this.formGroup.controls[key].updateValueAndValidity();
    }
    if (this.formGroup.invalid) {
      return;
    }
    if (this.items.length === 0) {
      this.messageService.error('请选择配送地址！');
      return;
    }
    if (this.items.some(x => !x.areaText)) {
      this.messageService.error('请选择配送地址！');
      return;
    }
    this.loading = true;
    if (this.item) {
      this.shopService.updateDispatchById(this.type, {
        ...this.formGroup.value,
        express: this.items,
        type: this.type
      }, this.item.id).subscribe(json => {
        if (json.code === 200) {
          this.messageService.success('操作成功！');
          this.modalRef.destroy();
          this.shopService.refreshDispatchList(this.type);
        }
        this.loading = false;
      })
    } else {
      this.shopService.createDispatch(this.type, {
        ...this.formGroup.value,
        express: this.items,
        type: this.type
      }).subscribe(json => {
        if (json.code === 200) {
          this.messageService.success('操作成功！');
          this.modalRef.destroy();
          this.shopService.refreshDispatchList(this.type);
        }
        this.loading = false;
      })
    };
  }
}
