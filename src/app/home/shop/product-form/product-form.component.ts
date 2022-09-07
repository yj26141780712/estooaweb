import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';
import { BaseinfoService } from 'src/app/api/baseinfo.service';
import { DeviceService } from 'src/app/api/device.service';
import { ProductService } from 'src/app/api/product.service';
import { ShopService } from 'src/app/api/shop.service';
import { SelectFile, UploadModalService } from 'src/app/components/upload-modal/upload-modal.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  isEdit = false;
  item: any;
  images: Array<{ id: number, url: string }> = [];
  coverIndex = 0;
  formGroup!: FormGroup;
  loading = false;
  modelOptions: Array<{ label: string, value: string }> = [];
  dispatchTypes: Array<{ label: string, value: string, remark: string, checked: boolean, items: any[] }> = []
  destory$ = new Subject();
  constructor(private fb: FormBuilder,
    private modalRef: NzModalRef,
    private messageService: NzMessageService,
    private nzImageService: NzImageService,
    private deviceService: DeviceService,
    private uploadModalService: UploadModalService,
    private baseinfoService: BaseinfoService,
    private productService: ProductService,
    private shopService: ShopService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      // deviceModelId: ['', [Validators.required]],
      title: ['', [Validators.required]],
      desc: ['', []],
      useRange: ['', []],
      unit: ['month', [Validators.required]],
      unitPrice: ['', [Validators.required]],
      deposit: ['', Validators.required]
    });
    if (this.item) {
      for (const key in this.formGroup.value) {
        this.formGroup.controls[key].setValue(this.item[key]);
      }
      if (Array.isArray(this.item.images) && this.item.images.length > 0) {
        this.images = this.item.images.map((x: any) => {
          return { id: x.id, url: x.url };
        })
        const findIndex = this.images.findIndex(x => x.id === this.item.coverImageId);
        this.coverIndex = findIndex;
      }
      if (this.item.rentPrice) {
        this.formGroup.controls['unit'].setValue(this.item.rentPrice.unit);
        this.formGroup.controls['unitPrice'].setValue(Number(this.item.rentPrice.unitPrice));
      }
    }
    this.deviceService.getModelList({})
      .pipe(takeUntil(this.destory$))
      .subscribe(json => {
        if (json.code === 200) {
          this.modelOptions = json.data.map((x: any) => {
            return { label: x.name, value: x.id }
          });
        }
      });
    this.baseinfoService.getDictDataListByTypeId(60)
      .pipe(takeUntil(this.destory$))
      .subscribe(json => {
        if (json.code === 200) {
          this.dispatchTypes = json.data.map((x: any) => {
            return { label: x.name, value: x.value, remark: x.remark, checked: x.value === 'express', items: [] };
          });
          this.dispatchTypes.forEach(x => {
            this.formGroup.addControl(x.value, new FormControl(null,
              x.checked ? [Validators.required] : []))
            this.shopService.getDispatchList(x.value, {})
              .subscribe(json => {
                if (json.code === 200) {
                  x.items = json.data.map((x: any) => {
                    return { id: x.id, name: x.name }
                  });
                }
              });
            if (this.item && this.item.dispatchTypes) {
              const types: string[] = this.item.dispatchTypes.split(',');
              const findIndex = types.findIndex(t => t === x.value);
              const ids: number[] = this.item.dispatchIds.split(',')
                .map((id: string) => Number(id));
              this.formGroup.controls[x.value].setValue(ids[findIndex]);
            }
          });
        }
      })
  }

  ngOnDestroy(): void {
    this.destory$.next('');
    this.destory$.complete();
  }

  formatterRMB = (value: number): string => `￥ ${value}`;
  parserRMB = (value: string): string => value.replace('￥ ', '');

  addImg() {
    this.uploadModalService.openSelect(this.selectImg, { multiple: true });
  }

  selectImg = (files: SelectFile[]) => {
    if (files.length > 0) {
      files.forEach(f => {
        this.images.push({
          id: f.id,
          url: f.url
        });
      })
    }
  }

  preview(e: MouseEvent, index: number) {
    e.stopPropagation();
    e.preventDefault();
    const ref = this.nzImageService.preview(this.images.map(x => {
      return { src: `${x.url}?t=${new Date().getTime()}` };
    }), {});
    ref.switchTo(index);
  }

  delete(e: MouseEvent, index: number) {
    e.stopPropagation();
    e.preventDefault();
    this.images.splice(index, 1);
    if (this.coverIndex > this.images.length - 1) {
      this.coverIndex = this.images.length - 1;
    }
  }

  dispatchTypeChange(tyeps: any[]) {
    this.dispatchTypes.forEach(x => {
      if (tyeps.indexOf(x.value) > -1) {
        this.formGroup.controls[x.value].setValidators([Validators.required]);
      } else {
        this.formGroup.controls[x.value].setValidators([]);
      }
    })
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
    this.loading = true;
    const obj: any = {
      ...this.formGroup.value,
      imageIds: this.images.map(x => x.id),
      coverImageId: this.images[this.coverIndex] && this.images[this.coverIndex].id || 0
    }
    obj.unitPrice = obj.unitPrice + '';
    obj.deposit = obj.deposit + '';
    const types = this.dispatchTypes.filter(x => x.checked);
    obj.dispatchIds = types.map(x => this.formGroup.value[x.value]).join(',');
    obj.dispatchTypes = types.map(x => x.value).join(',');
    obj.dispatchText = types.map(x => x.label).join(',');
    this.productService.createProduct(obj).subscribe(json => {
      if (json.code === 200) {
        this.messageService.success('操作成功！');
        this.modalRef.destroy();
        this.productService.refreshProductList();
      }
      this.loading = false;
    });
  }
}
