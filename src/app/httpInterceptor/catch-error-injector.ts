import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

const MAX_RETRY_NUM = 2;

export class CatchErrorInjector implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        let count = 0;
        return next.handle(req).pipe(
            catchError((err, err$) => {
                console.log(err, err$);
                count++;
                // err$其代表上游的Observable对象，当直接返回这个对象时，会启动catchError的重试机制。
                const tip = err.status === 200 ? err.body.error.reason : '系统繁忙，请稍后再试';
                if (err.status === 400 && count < MAX_RETRY_NUM) {
                    console.log(count, '重试次数');
                    return err$;
                } else {
                    throw err;
                }
            }),
        );
    }
}