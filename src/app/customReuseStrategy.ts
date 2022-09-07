import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";

export class CustomReuseStrategy implements RouteReuseStrategy {

    public static handlerMap = new Map<string, DetachedRouteHandle>();
    private static waitDelete: string; // 当前页未进行存储时需要删除
    private static currentDelete: string;  // 当前页存储过时需要删除

    // 允许路由复用
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return route && route.data && route.data["detached"];
    }

    // 当路由离开时触发 存储路由
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        const url = this.getFullRouteUrl(route);
        if (CustomReuseStrategy.waitDelete && CustomReuseStrategy.waitDelete === url) {
            // 如果待删除是当前路由，且未存储过则不存储快照
            CustomReuseStrategy.waitDelete = '';
            return;
        } else {
            // 如果待删除是当前路由，且存储过则不存储快照
            if (CustomReuseStrategy.currentDelete && CustomReuseStrategy.currentDelete === url) {
                CustomReuseStrategy.currentDelete = '';
                return;
            } else {
                CustomReuseStrategy.handlerMap.set(url, handle);
                this.addRedirectsRecursively(route);
            }
        }
    }

    // 是否允许还原路由
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return !!CustomReuseStrategy.handlerMap.get(this.getFullRouteUrl(route));
    }

    // 获取存储路由
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        return CustomReuseStrategy.handlerMap.get(this.getFullRouteUrl(route)) || null;
    }

    // 进入路由触发
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

    private addRedirectsRecursively(route: ActivatedRouteSnapshot): void {
        const config = route.routeConfig;
        if (config) {
            if (!config.loadChildren) {
                const routeFirstChild = route.firstChild;
                const routeFirstChildUrl = routeFirstChild ? this.getRouteUrlPaths(routeFirstChild).join('/') : '';
                const childConfigs = config.children;
                if (childConfigs) {
                    const childConfigWithRedirect = childConfigs.find(c => c.path === '' && !!c.redirectTo);
                    if (childConfigWithRedirect) {
                        childConfigWithRedirect.redirectTo = routeFirstChildUrl;
                    }
                }
            }
            route.children.forEach(childRoute => this.addRedirectsRecursively(childRoute));
        }
    }

    private getFullRouteUrl(route: ActivatedRouteSnapshot): string {
        return this.getFullRouteUrlPaths(route).filter(Boolean).join('/').replace('/', '_');
    }

    private getFullRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
        const paths = this.getRouteUrlPaths(route);
        return route.parent ? [...this.getFullRouteUrlPaths(route.parent), ...paths] : paths;
    }

    private getRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
        return route.url.map(urlSegment => urlSegment.path);
    }

    // 用于删除路由快照
    public static deleteRouteSnapshot(url: string): void {
        if (url[0] === '/') {
            url = url.substring(1);
        }
        url = url.replace('/', '_');
        if (CustomReuseStrategy.handlerMap.has(url)) {
            CustomReuseStrategy.handlerMap.delete(url);
            CustomReuseStrategy.currentDelete = url;
        } else {
            CustomReuseStrategy.waitDelete = url;
        }
    }
}
