import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { CACHE_AUTO_LOGIN } from "../services/global";

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const auto = localStorage.getItem(CACHE_AUTO_LOGIN);
    if (auto === 'true') {
      this.router.navigate(['/home/workplace']);
    }
    return true;
  }
}