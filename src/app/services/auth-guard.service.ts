import { CookieService } from './cookie.service';
import { Global } from './global';
import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router,
    private cs: CookieService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.checkUserIsLogin()) {
      setTimeout(() => {
        this.router.navigate(['login']);
      });
      return false;
    }
    if (this.checkUrl(state.url) && !this.checkAdmin()) {
      this.router.navigate(['result/403']);
      return false;
    }
    Global.routerUrl = state.url;
    return true;
  }

  checkUserIsLogin() {
    return this.cs.getCookie(CACHE_LTOKEN);
  }

  checkAdmin() {
    const user = JSON.parse(localStorage.getItem(CACHE_USERINFO));
    return user.userType === 0;
  }

  checkUrl(url: string) {
    return url.startsWith('/settings');
  }
}
