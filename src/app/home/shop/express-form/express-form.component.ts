import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { ShopService } from 'src/app/api/shop.service';

@Component({
  selector: 'app-express-form',
  templateUrl: './express-form.component.html',
  styleUrls: ['./express-form.component.scss']
})
export class ExpressFormComponent implements OnInit {

  isEdit = false;
  item: any;
  images: Array<{ id: number, url: string }> = [];
  coverIndex = 0;
  formGroup!: FormGroup;
  loading = false;
  modelOptions: Array<{ label: string, value: string }> = [];
  destory$ = new Subject();
  constructor(private fb: FormBuilder,
    private modalRef: NzModalRef,
    private messageService: NzMessageService,
    private shopService: ShopService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
    });
    if (this.item) {
      for (const key in this.formGroup.value) {
        this.formGroup.controls[key].setValue(this.item[key]);
      }
    }
  }

  ngOnDestroy(): void {
    this.destory$.next('');
    this.destory$.complete();
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
    if (this.isEdit) {
      this.shopService.updateExpressById({
        ...this.formGroup.value
      }, this.item.id).subscribe(json => {
        if (json.code === 200) {
          this.messageService.success('操作成功！');
          this.modalRef.destroy();
          this.shopService.refreshExpressList();
        }
        this.loading = false;
      })
    } else {
      this.shopService.createExpress({
        ...this.formGroup.value
      }).subscribe(json => {
        if (json.code === 200) {
          this.messageService.success('操作成功！');
          this.modalRef.destroy();
          this.shopService.refreshExpressList();
        }
        this.loading = false;
      })
    }
  }
}
