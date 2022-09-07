import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from '../services/cookie.service';
import { CACHE_AUTO_LOGIN, CACHE_REFRESH_TOKEN, CACHE_REFRESH_TOKEN_TIME, CACHE_TOKEN, CACHE_TOKEN_TIME, CACHE_USERINFO, Global } from '../services/global';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  passwordForm!: UntypedFormGroup;
  phoneForm!: UntypedFormGroup;
  error = '';
  loading = false;
  selectedIndex = 0;
  count = 60;
  sending = false;
  sendvcodeTime: any;
  vcodeText = '获取验证码';
  isAutoLogin = false;
  constructor(private fb: UntypedFormBuilder,
    private router: Router,
    private http: HttpClient,
    private el: ElementRef,
    private render: Renderer2,
    private cs: CookieService,
    private messageService: NzMessageService) {
    this.render.addClass(this.el.nativeElement, 'login-container');
  }

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      phone: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
    this.phoneForm = this.fb.group({
      phone: [null, [Validators.required]],
      code: [null, [Validators.required]]
    });
  }

  sendVcode() {
    this.phoneForm!.controls['phone'].markAsDirty();
    this.phoneForm!.controls['phone'].updateValueAndValidity();
    if (this.phoneForm.controls['phone'].invalid) {
      return;
    }
    this.sending = true;
    const phone = this.phoneForm!.value.phone;
    const url = Global.domain + 'account/sendVcode' + this.encode({
      phone,
      type: 2
    });
    this.http.get(url).subscribe((json: any) => {
      if (json.code === 200) {
        this.vcodeText = `${this.count}s后重发`;
        this.startVcode();
      } else {
        this.sending = false;
        this.messageService.error(json.message);
      }
    });
  }

  startVcode = () => {
    this.sendvcodeTime = setTimeout(() => {
      if (this.count <= 1) {
        this.endVcode(true);
        return;
      }
      this.count--;
      this.vcodeText = `${this.count}秒后重发`;
      this.startVcode();
    }, 1000);
  }

  endVcode = (isSend: boolean) => {
    clearTimeout(this.sendvcodeTime);
    this.vcodeText = isSend ? '重新发送' : '获取验证码';
    this.sendvcodeTime = null;
    this.sending = true;
    this.count = 60;
  }

  submitForm(): void {
    if (this.selectedIndex === 0) {
      for (const i in this.passwordForm!.controls) {
        this.passwordForm!.controls[i].markAsDirty();
        this.passwordForm!.controls[i].updateValueAndValidity();
      }
      if (this.passwordForm!.invalid) {
        return;
      }
      this.loading = true;
      const account = this.passwordForm!.value.phone;
      const password = this.passwordForm!.value.password;
      this.http.get(Global.domain + 'account/loginByPassword' + this.encode({
        account, password
      })).subscribe((json: any) => {
        if (json.code === 200) {
          localStorage.setItem(CACHE_USERINFO, JSON.stringify(json.obj));
          localStorage.setItem(CACHE_AUTO_LOGIN, this.isAutoLogin + '');
          this.cs.addCookie(CACHE_REFRESH_TOKEN, json.data.refreshToken, CACHE_REFRESH_TOKEN_TIME);
          this.cs.addCookie(CACHE_TOKEN, json.data.token, CACHE_TOKEN_TIME);
          this.router.navigate(['/home/workplace']);
        } else {
          this.messageService.error(json.message);
        }
        this.loading = false;
      });
    } else if (this.selectedIndex === 1) {
      for (const i in this.phoneForm!.controls) {
        this.phoneForm!.controls[i].markAsDirty();
        this.phoneForm!.controls[i].updateValueAndValidity();
      }
      if (this.phoneForm!.invalid) {
        return;
      }
      const phone = this.phoneForm!.value.phone;
      const code = this.phoneForm!.value.code;
      this.http.get(Global.domain + 'account/loginByPhone' + this.encode({
        phone, code
      })).subscribe((json: any) => {
        if (json.code === 200) {
          localStorage.setItem(CACHE_USERINFO, JSON.stringify(json.obj));
          localStorage.setItem(CACHE_AUTO_LOGIN, this.isAutoLogin + '');
          this.cs.addCookie(CACHE_REFRESH_TOKEN, json.data.refreshToken, CACHE_REFRESH_TOKEN_TIME);
          this.cs.addCookie(CACHE_TOKEN, json.data.token, CACHE_TOKEN_TIME);
          this.router.navigate(['/home/workplace']);
        } else {
          this.messageService.error(json.message);
        }
        this.loading = false;
      });
    }

  }

  encode(params: any) {
    let str = '';
    if (params) {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const value = (params[key] === null || params[key] === undefined) ? '' : params[key];
          str += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
        }
      }
      str = str.length > 0 ? ('?' + str.substring(0, str.length - 1)) : '';
    }
    return str;
  }

  selectChange($event: any) {
    const index = $event.index;
    switch (index) {
      case 0:
        this.passwordForm!.reset();
        break;
      case 1:
        this.phoneForm!.reset();
        this.sending = false;
        this.vcodeText = '获取验证码';
        clearTimeout(this.sendvcodeTime);
        break;
    }
  }

  updatePassword() {
    this.messageService.warning('忘记密码功能未开放！');
  }

  register() {
    this.messageService.warning('后台注册功能未开放！');
  }
}
