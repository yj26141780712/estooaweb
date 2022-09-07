import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { filter, tap } from 'rxjs/operators';
import { of } from 'rxjs';

export class CacheInjector implements HttpInterceptor {
    static cachebleUrlList = [''];
    static cacheRequetMap = new Map();
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // 判断是否需要缓存此条请求
        if (!this.canCacherReq(req)) {
            return next.handle(req);
        }

        // 判断目标缓存请求的值是否初始化
        const cachedResponse = CacheInjector.cacheRequetMap.get(req.url);
        if (cachedResponse) {
            return of(cachedResponse);
        }

        // 如果没有初始化，在获取到response之后缓存到map里面
        return next.handle(req).pipe(
            filter(event => event instanceof HttpResponse),
            tap(event => {
                console.log(event, '响应事件');
                CacheInjector.cacheRequetMap.set(req.url, event);
            })
        );
    }

    // 判断当前请求是否需要缓存
    canCacherReq(req: HttpRequest<any>): boolean {
        return CacheInjector.cachebleUrlList.indexOf(req.url) !== -1;
    }

    // 查询缓存的接口列表
    static getCachedUrlList(): string[] {
        return [...CacheInjector.cacheRequetMap.keys()];
    }

    // 外部主动刷新
    static refreshReq(req) {
        CacheInjector.cacheRequetMap.delete(req);
    }
}
