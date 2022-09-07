import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from '../services/http.service';
import { SearchCondition } from '../types/search-conditon';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  refreshRoleList$ = new Subject();
  constructor(private httpService: HttpService) { }

  refreshRoleList() {
    this.refreshRoleList$.next('');
  }

  getRoleList(condition: SearchCondition) {
    return this.httpService.httpGetObservable('role/list', {
      ...condition
    });
  }

  getMenusById(id: number) {
    return this.httpService.httpGetObservable('role/menusById', {
      id
    });
  }

  createRole(obj: any) {
    return this.httpService.httpPostObservable('role/create', {
      ...obj
    });
  }

  updateRoleById(obj: any, id: number) {
    return this.httpService.httpPostObservable('role/updateById' +
      this.httpService.encode({ id }), {
      ...obj
    });
  }

  updateMenusById(menus: string, id: number) {
    return this.httpService.httpPostObservable('role/updateMenusById' +
      this.httpService.encode({ id }), {
      menus
    });
  }

  deleteRoleById(id: number) {
    return this.httpService.httpGetObservable('role/deleteById', { id })
  }

}
