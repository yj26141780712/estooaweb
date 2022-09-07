import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AccountService } from 'src/app/api/account.service';
import { BaseinfoService } from 'src/app/api/baseinfo.service';
import { RoleService } from 'src/app/api/role.service';
import { CACHE_ACCOUNT_LEVEL_ID, CACHE_ACCOUNT_TYPE_ID } from 'src/app/services/global';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountFormComponent implements OnInit {


  isEdit = false;
  item: any;
  formGroup!: FormGroup;
  loading = false;
  typeOptions: any[] = [];
  levelOptions: any[] = [];
  roleOptions: any[] = [];
  constructor(private fb: FormBuilder,
    private modalRef: NzModalRef,
    private messageService: NzMessageService,
    private accountService: AccountService,
    private baseinfoService: BaseinfoService,
    private roleService: RoleService) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      account: [{ value: this.isEdit ? this.item['account'] : '', disabled: this.isEdit }, [
        Validators.required, Validators.pattern('^[a-zA-Z0-9]{8,20}$'),
      ]],
      phone: ['', [Validators.required,
      Validators.pattern(`^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])[0-9]{8}$`)]],
      // /^(?![A-z0-9]+$)(?=.[^%&',;=?$\x22])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,20}$/
      password: ['', [Validators.required]],
      accountType: ['', [Validators.required]],
      accountLevel: ['', [Validators.required]],
      roleId: ['', []],
      referencePhone: [
        { value: this.isEdit ? this.item['referencePhone'] : '', disabled: this.isEdit },
        [Validators.pattern(`^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])[0-9]{8}$`)]]
    })
    if (this.item) {
      for (const key in this.formGroup.value) {
        this.formGroup.controls[key].setValue(this.item[key]);
      }
    }
    this.baseinfoService.getDictDataListByTypeId(CACHE_ACCOUNT_TYPE_ID)
      .subscribe(json => {
        if (json.code === 200) {
          this.typeOptions = json.data.map((x: any) => {
            return { label: x.name, value: x.value }
          })
        }
      });
    this.baseinfoService.getDictDataListByTypeId(CACHE_ACCOUNT_LEVEL_ID)
      .subscribe(json => {
        if (json.code === 200) {
          this.levelOptions = json.data.map((x: any) => {
            return { label: x.name, value: x.value }
          });
        }
      });
    this.roleService.getRoleList({}).subscribe(json => {
      if (json.code === 200) {
        this.roleOptions = json.data.map((x: any) => {
          return { label: x.name, value: x.id };
        });
      }
    });
  }

  cancle() {
    this.modalRef.destroy();
  }

  submit() {
    for (const key in this.formGroup.controls) {
      this.formGroup.controls[key].markAsDirty();
      this.formGroup.controls[key].updateValueAndValidity();
    }
    if (this.formGroup.invalid) {
      return;
    }
    this.loading = true;
    if (this.isEdit) {
      this.accountService.updateAccountById({
        ...this.formGroup.value,
        roleId: this.formGroup.value.roleId || 0
      }, this.item.id)
        .subscribe(json => {
          if (json.code === 200) {
            this.messageService.success('操作成功！');
            this.modalRef.destroy();
            this.accountService.refreshAccountList();
          }
          this.loading = false;
        })
    } else {
      this.accountService.createAccount({
        ...this.formGroup.value,
        roleId: this.formGroup.value.roleId || 0
      }).subscribe(json => {
        if (json.code === 200) {
          this.messageService.success('操作成功！');
          this.modalRef.destroy();
          this.accountService.refreshAccountList();
        }
        this.loading = false;
      })
    }
  }
}
