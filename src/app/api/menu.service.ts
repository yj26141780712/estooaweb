import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from '../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  refresh$ = new Subject();
  constructor(private httpService: HttpService) { }

  refreshMenuList() {
    this.refresh$.next('');
  }

  getMenuList() {
    return this.httpService.httpGetObservable('menu/list', {});
  }

  getMenuByRoleId(roleId: number) {
    return this.httpService.httpGetObservable('menu/listByRoleId', { roleId });
  }

  createMenu(menu: any) {
    return this.httpService.httpPostObservable('menu/create', {
      ...menu
    })
  }

  updateMenuById(menu: any, id: number) {
    return this.httpService.httpPostObservable(
      'menu/updateById' + this.httpService.encode({ id }),
      { ...menu });
  }

  deleteMenuById(id: number) {
    return this.httpService.httpGetObservable('menu/deleteById', { id });
  }
}
