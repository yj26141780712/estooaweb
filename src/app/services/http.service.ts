import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { CookieService } from './cookie.service';
import { HttpRequest } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { CACHE_REFRESH_TOKEN, CACHE_REFRESH_TOKEN_TIME, CACHE_TOKEN, CACHE_TOKEN_TIME, Global } from './global';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  headers = new HttpHeaders();
  // 判断是否需要重新获取token
  tokenLock = false;
  tokenTime = 0;
  constructor(private http: HttpClient,
    private nms: NzMessageService,
    private router: Router,
    private cs: CookieService) {

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

  /**
   * http get返回Observable<Response>方法
   * @param url api url
   * @param params 传递参数
   * @param loading 是否显示loading 默认不loading
   * @param showError 是否提示错误 默认提示
   */
  httpGetObservable(url: string, params: any, OtherDomain?: string): Observable<any> {
    url = OtherDomain ? OtherDomain + url : Global.domain + url;
    return this.http.get(url + this.encode(params));
  }

  /**
   * http post返回Observable<Response>方法
   * @param url api url
   * @param params 传递参数
   * @param loading 是否显示loading 默认不loading
   * @param showError 是否提示错误 默认提示
   */
  httpPostObservable(url: string, params: any, OtherDomain?: string): Observable<any> {
    url = OtherDomain ? OtherDomain + url : Global.domain + url;
    return this.http.post(url, params);
  }

  httpPostFormData(url: string, formData: FormData, OtherDomain?: string): Observable<any> {
    url = OtherDomain ? OtherDomain + url : Global.domain + url;
    return this.http.post(url, formData);
  }

  httpActionExportProgress(method: string, url: string, params: any, OtherDomain?: string): Observable<any> {
    url = OtherDomain ? OtherDomain + url : Global.domain + url;
    const req = new HttpRequest(method, url, params, {
      reportProgress: true,
      responseType: 'blob',
    }); // angular http 请求默认返回格式json 设置返回类型blob
    return this.http.request(req);
  }

  httpProgress(method: string, url: string, params: any, OtherDomain?: string): Observable<any> {
    url = OtherDomain ? OtherDomain + url : Global.domain + url;
    return Observable.create((observer: Observer<any>) => {
      const ajax = () => {
        const token = this.cs.getCookie(CACHE_TOKEN) || '';
        const req = new HttpRequest(method, url,
          params, { headers: new HttpHeaders({ token }), reportProgress: true }
        );
        this.http
          .request(req).subscribe((event: any) => {
            if (event instanceof HttpResponse) {
              if ((event.body as any).code === 502) {
                this.refreshToken().subscribe((newToken: string) => {
                  if (newToken) {
                    ajax();
                  } else {
                    this.againLogin(); // 刷新token失败重新登录
                  }
                });
              } else {
                observer.next(event.body);
                observer.complete();
              }
            }
          }, err => {
            const message = err && err.message || err;
            observer.next({ code: 500, message: '接口调用失败,' + message });
            observer.complete();
          });
      };
      ajax();
    });
  }

  httpProgressEvent(method: string, url: string, params: any, OtherDomain?: string): Observable<any> {
    url = OtherDomain ? OtherDomain + url : Global.domain + url;
    return Observable.create((observer: Observer<any>) => {
      const ajax = () => {
        const token = this.cs.getCookie(CACHE_TOKEN) || '';
        const req = new HttpRequest(method, url,
          params, { headers: new HttpHeaders({ token }), reportProgress: true }
        );
        this.http
          .request(req).subscribe((event: any) => {
            observer.next(event);
            if (event instanceof HttpResponse) {
              if ((event.body as any).code === 502) {
                this.refreshToken().subscribe((newToken: string) => {
                  if (newToken) {
                    ajax();
                  } else {
                    this.againLogin(); // 刷新token失败重新登录
                  }
                });
              } else {
                observer.next(event.body);
                observer.complete();
              }
            }
          }, err => {
            const message = err && err.message || err;
            observer.next({ code: 500, message: '接口调用失败,' + message });
            observer.complete();
          });
      };
      ajax();
    });
  }

  httpDownload(url: string, params: any, OtherDomain?: string): Observable<any> {
    url = OtherDomain ? OtherDomain + url : Global.domain + url;
    return Observable.create((observer: Observer<any>) => {
      this.checkToken().subscribe(token => {
        if (token) {
          const headers = new HttpHeaders({ token, responseType: 'blob' });
          this.http.get(url + this.encode(params), { headers }).subscribe((json: any) => {
            if (!Global.tokenIsInvalid) {
              return;
            }
            if (json.code === 301) {
              Global.tokenIsInvalid = false;
              this.againLogin();
              return;
            }
            this.handleInfo(json.code, json.message);
            observer.next(json);
            observer.complete();
          }, err => {
            observer.error(err);
            observer.complete();
          });
        } else {
          observer.error({ message: 'token 不存在!' });
        }
      }, err => {
        observer.error(err);
      });
    });
  }

  httpDownloadByArraybuffer(url: string, params: any, type: string = 'application/vnd.ms-excel', OtherDomain?: string): Observable<any> {
    url = OtherDomain ? OtherDomain + url : Global.domain + url;
    return Observable.create((observer: Observer<any>) => {
      const ajax = () => {
        const token = this.cs.getCookie(CACHE_TOKEN);
        this.http.get(url + this.encode(params), {
          headers: { token: token || '' },
          responseType: 'arraybuffer'
        }).subscribe((json: any) => {
          console.log(json);
          if (json.code === 502) { // token失效刷新token
            this.refreshToken().subscribe((newToken: string) => {
              if (newToken) {
                ajax();
              } else {
                this.againLogin(); // 刷新token失败重新登录
              }
            });
          } else {
            const blob = new Blob([json], { type });
            observer.next(blob);
          }
        }, err => {
          observer.error(err);
          observer.complete();
        });
      };
      ajax();
    });
  }

  againLogin() {
    this.nms.error('用户登陆失效请重新登录！');
    this.router.navigate(['/login']);
  }

  /**
   * 验证Token是否失效 失效后重新刷新token
   */
  checkToken(): Observable<string> {
    console.log(123);
    return Observable.create((observer: Observer<string>) => {
      const token = this.cs.getCookie(CACHE_TOKEN);
      // this.refreshltoken();
      if (token) {
        observer.next(token);
        observer.complete();
      } else {
        if (this.tokenLock && this.tokenTime < 30) {
          setTimeout(() => {
            this.tokenTime++;
            this.checkToken().subscribe(observer);
          }, 500);
        } else if (this.tokenTime >= 30) { // 500*30是15S，15s没有响应就直接跳登录页
          this.cs.delCookie(CACHE_TOKEN);
          this.tokenLock = false;
          this.tokenTime = 0;
          this.nms.error('用户登陆失效请重新登陆！');
          this.router.navigate(['/login']);
        } else {
          this.tokenLock = true;
          const ltoken = this.cs.getCookie(CACHE_REFRESH_TOKEN);
          if (!ltoken) {
            observer.error('');
            observer.complete();
          }
          this.http.get(Global.domain + 'account/refreshToken?refreshToken=' + ltoken)
            .subscribe((json: any) => {
              this.tokenLock = false;
              this.tokenTime = 0;
              if (json.code === 200) {
                const newToken = json.data.token;
                this.cs.addCookie(CACHE_TOKEN, newToken, CACHE_TOKEN_TIME);
                observer.next(newToken);
              } else {
                observer.error('');
              }
              observer.complete();
            }, err => {
              observer.error('');
              observer.complete();
            });
        }
      }
    });
  }

  refreshltoken() {
    const ltoken = this.cs.getCookie(CACHE_REFRESH_TOKEN);
    if (ltoken) {
      this.cs.addCookie(CACHE_REFRESH_TOKEN, ltoken, CACHE_REFRESH_TOKEN_TIME);
    }
  }

  refreshToken(): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
      const ltoken = this.cs.getCookie(CACHE_REFRESH_TOKEN);
      if (!ltoken) {
        observer.next('');
        observer.complete();
      }
      this.http.get(Global.domain + 'account/refreshToken?refreshToken=' + ltoken)
        .subscribe((json: any) => {
          if (json.code === 200) {
            const newToken = json.data.token;
            this.cs.addCookie(CACHE_TOKEN, newToken, CACHE_TOKEN_TIME);
            observer.next(newToken);
          } else {
            observer.next('');
          }
          observer.complete();
        }, err => {
          observer.next('');
          observer.complete();
        });
    });
  }

  private handleInfo(code: number, msg: string) {
    if (code === 200) {
      return;
    }
    console.error(msg);
  }
}
