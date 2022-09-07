import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';
import { BaseinfoService } from 'src/app/api/baseinfo.service';
import { DeviceService } from 'src/app/api/device.service';
import { ProductService } from 'src/app/api/product.service';
import { ShopService } from 'src/app/api/shop.service';
import { UploadModalService, SelectFile } from 'src/app/components/upload-modal/upload-modal.service';

@Component({
  selector: 'app-product-dispatch-form',
  templateUrl: './product-dispatch-form.component.html',
  styleUrls: ['./product-dispatch-form.component.scss']
})
export class ProductDispatchFormComponent implements OnInit {

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
      title: ['', [Validators.required]],
    });
    if (this.item) {
      if (this.item.title) {
        this.formGroup.controls['title'].setValue(this.item.title);
        this.formGroup.controls['title'].disable();
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
          let types: string[] = [];
          if (this.item && this.item.dispatchTypes) {
            types = this.item.dispatchTypes.split(',');
          }
          this.dispatchTypes = json.data.map((x: any) => {
            return {
              label: x.name, value: x.value, remark: x.remark,
              checked: types.length > 0 ? types.indexOf(x.value) > -1 : x.value === 'express', items: []
            };
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
            if (types.length > 0) {
              const findIndex = types.findIndex(t => t === x.value);
              if (findIndex > -1) {
                const ids: number[] = this.item.dispatchIds.split(',')
                  .map((id: string) => Number(id));
                this.formGroup.controls[x.value].setValue(ids[findIndex]);
              }
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
    const types = this.dispatchTypes.filter(x => x.checked);
    const dispatchIds = types.map(x => this.formGroup.value[x.value]).join(',');
    const dispatchTypes = types.map(x => x.value).join(',');
    const dispatchText = types.map(x => x.label).join(',');
    this.productService.updateProductDispatchById({
      dispatchIds,
      dispatchTypes,
      dispatchText
    }, this.item.id).subscribe(json => {
      if (json.code === 200) {
        this.messageService.success('操作成功！');
        this.modalRef.destroy();
        this.productService.refreshProductList();
      }
      this.loading = false;
    })
  }

}
