import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { ProductService } from 'src/app/api/product.service';

@Component({
  selector: 'app-product-rent-price-form',
  templateUrl: './product-rent-price-form.component.html',
  styleUrls: ['./product-rent-price-form.component.scss']
})
export class ProductRentPriceFormComponent implements OnInit {

  isEdit = false;
  item: any;
  formGroup!: FormGroup;
  loading = false;
  destory$ = new Subject<void>();
  constructor(private fb: FormBuilder,
    private modalRef: NzModalRef,
    private messageService: NzMessageService,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      title: [''],
      productId: [''],
      unit: ['month', [Validators.required]],
      unitPrice: [null, [Validators.required]],
      deposit: ['', Validators.required]
    });
    if (this.item) {
      if (this.item.title) {
        this.formGroup.controls['title'].setValue(this.item.title);
        this.formGroup.controls['title'].disable();
      }
      if (this.item.id) {
        this.formGroup.controls['productId'].setValue(this.item.id);
      }
      if (this.item.rentPrice) {
        this.formGroup.controls['unit'].setValue(this.item.rentPrice.unit);
        this.formGroup.controls['unitPrice'].setValue(this.item.rentPrice.unitPrice);
        this.formGroup.controls['deposit'].setValue(this.item.rentPrice.deposit);
      }
    }
  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  formatterRMB = (value: number): string => `￥ ${value}`;
  parserRMB = (value: string): string => value.replace('￥ ', '');

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
    this.productService.setProductRentPrice({
      ...this.formGroup.value
    }).subscribe(json => {
      if (json.code === 200) {
        this.messageService.success('操作成功！')
        this.modalRef.destroy();
        this.productService.refreshProductList();
      }
    });
  }
}
