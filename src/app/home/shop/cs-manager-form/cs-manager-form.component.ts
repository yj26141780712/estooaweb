import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/api/account.service';
import { ShopService } from 'src/app/api/shop.service';
import { SelectFile, UploadModalService } from 'src/app/components/upload-modal/upload-modal.service';
import { BaseForm } from '../../BaseForm';

@Component({
  selector: 'app-cs-manager-form',
  templateUrl: './cs-manager-form.component.html',
  styleUrls: ['./cs-manager-form.component.scss']
})
export class CsManagerFormComponent extends BaseForm implements OnInit, OnDestroy {

  image!: { id: number, url: string } | null;
  list: { label: string, value: string }[] = [];
  destroy$ = new Subject<void>()
  constructor(modalRef: NzModalRef,
    private fb: FormBuilder,
    private nzImageService: NzImageService,
    private messageService: NzMessageService,
    private uploadModalService: UploadModalService,
    private accountService: AccountService,
    private shopService: ShopService) {
    super(modalRef);
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      nickname: [null, Validators.required],
      avatarId: [null],
      adminId: [null, Validators.required],
      maxNum: [10, Validators.required],
      status: ['online', Validators.required]
    });
    if (this.item) {
      for (const key in this.formGroup.controls) {
        this.formGroup.controls[key].setValue(this.item[key]);
      }
      if (this.item.avatar) {
        this.image = {
          id: this.item.avatar.id,
          url: this.item.avatar.url,
        }
      }
    }
    this.accountService.getAdminList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(json => {
        this.list = json.code === 200 ? json.data.map((x: any) => {
          return { label: x.name || x.account, value: x.id };
        }) : [];
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addImg() {
    this.uploadModalService.openSelect(this.selectImg, { multiple: true });
  }

  selectImg = (files: SelectFile[]) => {
    const file = files[0];
    console.log(file);
    if (file) {
      this.image = {
        id: file.id,
        url: file.url
      }
    }
  }

  preview(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (this.image) {
      this.nzImageService.preview([
        {
          src: this.image.url
        }
      ], {});
    }
  }

  delete(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.image = null;
  }

  submitForm() {
    this.checkForm();
    if (this.formGroup.invalid) {
      return;
    }
    this.loading = true;
    const obj = {
      ...this.formGroup.value,
      avatarId: this.image?.id || 0,
    }
    console.log(this.image);
    if (this.item) {
      this.shopService.updateCustomerService(obj, this.item.id)
        .subscribe(json => {
          if (json.code === 200) {
            this.messageService.success('操作成功！');
            this.close();
            this.shopService.refreshCsList$.next();
          }
          this.loading = false;
        });
    } else {
      this.shopService.createCustomerService(obj)
        .subscribe(json => {
          if (json.code === 200) {
            this.messageService.success('操作成功！');
            this.close();
            this.shopService.refreshCsList$.next();
          }
          this.loading = false;
        });
    }
  }
}
