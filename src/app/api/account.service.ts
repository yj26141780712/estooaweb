import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from '../services/http.service';
import { SearchCondition } from '../types/search-conditon';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  csStatus = {
    'online': '在线',
    'offline': '离线'
  };
  refreshAccountList$ = new Subject();
  constructor(private httpService: HttpService) { }

  getMenuList() {
    return this.httpService.httpGetObservable('account/menus', {
    });
  }

  getAccountDetail() {
    return this.httpService.httpGetObservable('account/selfDetail', {});
  }

  refreshAccountList() {
    this.refreshAccountList$.next('');
  }

  getAccountList(condition: SearchCondition) {
    return this.httpService.httpGetObservable('account/list', {
      ...condition
    });
  }

  createAccount(obj: any) {
    return this.httpService.httpPostObservable('account/create', {
      ...obj
    });
  }

  updateAccountById(obj: any, id: number) {
    return this.httpService.httpPostObservable('account/updateById' +
      this.httpService.encode({ id }), {
      ...obj
    });
  }

  deleteAccountById(id: number) {
    return this.httpService.httpGetObservable('account/deleteById', {
      id
    });
  }

  updateSelfAccount(obj: any) {
    return this.httpService.httpPostObservable('account/updateSelf', {
      ...obj
    });
  }

  getLogList(condition: SearchCondition) {
    return this.httpService.httpGetObservable('log/list', {
      ...condition
    })
  }

  getAdminList() {
    return this.httpService.httpGetObservable('account/adminList', {});
  }
}
