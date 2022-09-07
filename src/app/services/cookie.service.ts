import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  expires = 60 * 1000;
  constructor() { }

  /**
   *
   * @param name 名称
   * @param value 值
   * @param time 时间  例如: 1表示1分钟
   */
  public addCookie(name: string, value: string, time: number) {
    const exp = new Date();
    if (time && time !== 0 && !isNaN(Number(time))) {
      exp.setTime(exp.getTime() + this.expires * time);
    } else {
      exp.setTime(exp.getTime() + this.expires);
    }
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + exp.toUTCString() + '; path=/;';
  }

  public getCookie(name: string) {
    let arr = null;
    const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    // tslint:disable-next-line:no-conditional-assignment
    if (arr = document.cookie.match(reg)) {
      return decodeURIComponent(arr[2]);
    } else {
      return null;
    }
  }

  public delCookie(name: string) {
    const exp = new Date();
    exp.setTime(exp.getTime() - 1);
    const cval = this.getCookie(name);
    if (cval != null) {
      document.cookie = name + '=' + cval + ';expires=' + exp.toUTCString() + '; path=/;';
    }
  }
}
