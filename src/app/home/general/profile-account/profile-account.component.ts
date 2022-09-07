import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { AccountService } from 'src/app/api/account.service';

@Component({
  selector: 'app-profile-account',
  templateUrl: './profile-account.component.html',
  styleUrls: ['./profile-account.component.scss']
})
export class ProfileAccountComponent implements OnInit, OnDestroy {

  accountForm!: FormGroup;
  loading = false;
  destroy$ = new Subject();
  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private messageService: NzMessageService) { }

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      account: ['', [Validators.required]],
      phone: ['', [
        Validators.required,
        Validators.pattern(`^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])[0-9]{8}$`)
      ]],
      password: ['', []]
    });
    this.accountService.getAccountDetail().subscribe(json => {
      if (json.code === 200) {
        this.accountForm.controls['account'].setValue(json.data?.account);
        this.accountForm.controls['phone'].setValue(json.data?.phone);
      }
      this.accountForm.controls['account'].disable();
    })
  }

  ngOnDestroy(): void {

  }

  updateAccount() {
    for (const key in this.accountForm.controls) {
      this.accountForm.controls[key].markAsDirty();
      this.accountForm.controls[key].updateValueAndValidity();
    }
    if (this.accountForm.invalid) {
      return;
    }
    this.loading = true;
    this.accountService.updateSelfAccount({
      ...this.accountForm.value
    }).subscribe(json => {
      if (json.code === 200) {
        this.messageService.success('操作成功！');
      }
      this.loading = false;
    })
  }
}
