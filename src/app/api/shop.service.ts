import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from '../services/http.service';
import { SearchCondition } from '../types/search-conditon';

export enum Dispatch {
  express = 'express',
  store = 'store',
  selfetch = 'selfetch'
}

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  weekList = [[1, '周一'], [2, '周二'], [3, '周三'], [4, '周四'], [5, '周五'], [6, '周六'], [7, '周日']]
  storeStatusList = [[0, '禁用'], [1, '启用']];
  refreshOrderList$ = new Subject<void>();
  refreshExpressList$ = new Subject<void>();
  refreshDispatchList$ = new Subject<string>();
  refreshStoreList$ = new Subject<void>();
  /**刷新客服列表 */
  refreshCsList$ = new Subject<void>();
  constructor(private httpService: HttpService) { }

  refreshDispatchList(type: string) {
    this.refreshDispatchList$.next(type);
  }

  createDispatch(type: string, obj: any) {
    return this.httpService.httpPostObservable(`shop/dispatch/${type}/create`, {
      ...obj
    });
  }

  updateDispatchById(type: string, obj: any, id: number) {
    return this.httpService.httpPostObservable(`shop/dispatch/${type}/updateById` +
      this.httpService.encode({ id }), {
      ...obj
    })
  }

  deleteDispatchById(type: string, id: number) {
    return this.httpService.httpGetObservable(`shop/dispatch/${type}/deleteById`, {
      id
    })
  }

  getDispatchList(type: string, condition: SearchCondition) {
    return this.httpService.httpGetObservable(`shop/dispatch/${type}/list`, {
      ...condition
    });
  }

  refreshStoreList() {
    this.refreshStoreList$.next();
  }

  createStore(obj: any) {
    return this.httpService.httpPostObservable('shop/store/create', {
      ...obj
    });
  }

  updateStoreById(obj: any, id: number) {
    return this.httpService.httpPostObservable('shop/store/updateById' +
      this.httpService.encode({ id }), {
      ...obj
    });
  }

  updateStoreStatusById(obj: any, id: number) {
    return this.httpService.httpPostObservable('shop/store/updateById' +
      this.httpService.encode({ id }), {
      ...obj
    });
  }

  deleteStoreById(id: number) {
    return this.httpService.httpGetObservable('shop/store/deleteById', { id });
  }

  getStoreList(condition: SearchCondition) {
    return this.httpService.httpGetObservable('shop/store/list', {
      ...condition
    });
  }

  getAccountListByPhone(phone: string) {
    return this.httpService.httpGetObservable('account/list', {});
  }

  refreshExpressList() {
    this.refreshExpressList$.next();
  }

  createExpress(obj: any) {
    return this.httpService.httpPostObservable('shop/express/create', {
      ...obj
    });
  }

  updateExpressById(obj: any, id: number) {
    return this.httpService.httpPostObservable('shop/express/updateById' +
      this.httpService.encode({ id }), {
      ...obj
    });
  }

  deleteExpressById(id: number) {
    return this.httpService.httpGetObservable('shop/express/deleteById', {
      id
    })
  }

  getExpressList(condition: SearchCondition) {
    return this.httpService.httpGetObservable('shop/express/list', {
      ...condition
    });
  }

  refreshOrderList() {
    this.refreshOrderList$.next();
  }

  getOrderList(condition: SearchCondition) {
    return this.httpService.httpGetObservable('shop/order/list', {
      ...condition
    });
  }

  // 发货
  sendProduct(obj: any) {
    return this.httpService.httpPostObservable('shop/order/send', {
      ...obj
    });
  }

  getOrderLogList(condition: SearchCondition) {
    return this.httpService.httpGetObservable('shop/order/log', {
      ...condition
    });
  }

  getOrderDetail(orderId: number) {
    return this.httpService.httpGetObservable('shop/order/detail', {
      orderId
    });
  }

  createCustomerService(obj: any) {
    return this.httpService.httpPostObservable('shop/customerService/create', {
      ...obj
    });
  }

  updateCustomerService(obj: any, id: number) {
    return this.httpService.httpPostObservable('shop/customerService/update' +
      this.httpService.encode({ id }), {
      ...obj
    });
  }

  deleteCustomerService(id: number) {
    return this.httpService.httpGetObservable('shop/customerService/delete', {});
  }

  getCustomerServiceList(search: SearchCondition) {
    return this.httpService.httpGetObservable('shop/customerService/list', {
      ...search
    });
  }
}
