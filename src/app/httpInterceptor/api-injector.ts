import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CookieService } from '../services/cookie.service';
import { CACHE_REFRESH_TOKEN, CACHE_TOKEN, CACHE_TOKEN_TIME, Global } from '../services/global';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';



const MAX_RETRY_NUM = 2;
// 判断token是否过期 如果token已经过期 从后台服务获取token

@Injectable()
export class ApiInjector implements HttpInterceptor {

    private refreshTokenInProgress = false;
    private refreshTokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    constructor(private http: HttpClient,
        private cookieService: CookieService,
        private messageService: NzMessageService,
        private router: Router) { }

    authenticateRequest(req: HttpRequest<any>) {
        const token = this.cookieService.getCookie(CACHE_TOKEN);
        if (token != null) {
            return req.clone({
                setHeaders: { token }
            });
        }
        else {
            return req;
        }
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let count = 0;
        return next.handle(this.authenticateRequest(req))
            .pipe(mergeMap((event: any) => {
                if (event instanceof HttpResponse) {
                    const body = event.body;
                    if (body && body.code === 502) { // token过期
                        return this.refreshedHttp(req, next);
                    } else if (body && body.code === 500) {
                        this.messageService.error(body.message);
                    }
                }
                return of(event);
            }), catchError((err, err$) => {
                console.log(err, err$);
                count++;
                // err$其代表上游的Observable对象，当直接返回这个对象时，会启动catchError的重试机制。
                const tip = err.status === 200 ? err.body.error.reason : '系统繁忙，请稍后再试';
                if (err.status === 400 && count < MAX_RETRY_NUM) {
                    console.log(count, '重试次数');
                    return err$;
                } else {
                    this.messageService.error(tip);
                    throw err;
                }
            }));
    }

    refreshedHttp(req: HttpRequest<any>, next: HttpHandler) {
        if (this.refreshTokenInProgress) { // 如果正在刷新token
            return this.refreshTokenSubject
                .pipe(
                    filter(result => result),
                    take(1),
                    switchMap(() => next.handle(this.authenticateRequest(req)))
                );
        } else {
            this.refreshTokenInProgress = true;
            this.refreshTokenSubject.next(false);
            return this.refreshToken().pipe(
                switchMap((newToken: string) => {
                    this.cookieService.addCookie(CACHE_TOKEN, newToken, CACHE_TOKEN_TIME);
                    return next.handle(this.authenticateRequest(req));
                }),
                finalize(() => {
                    this.refreshTokenInProgress = false;
                    this.refreshTokenSubject.next(true);
                }));
        }
    }

    refreshToken() {
        const ltoken = this.cookieService.getCookie(CACHE_REFRESH_TOKEN);
        return this.http.get(Global.domain + 'account/refreshToken?refreshToken=' + ltoken)
            .pipe(map((json: any) => {
                if (json && json.code === 200) {
                    return json.data.token;
                } else {
                    this.router.navigate(['/login']);
                }
            }));
    }
}
