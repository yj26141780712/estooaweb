import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from '../services/http.service';
import { SearchCondition } from '../types/search-conditon';



@Injectable({
  providedIn: 'root'
})
export class ProductService {

  statusList = [[0, '隐藏'], [1, '上架'], [2, '下架']];
  refreshProductList$ = new Subject();
  constructor(private httpService: HttpService) { }

  refreshProductList() {
    this.refreshProductList$.next('');
  }

  createProduct(obj: any) {
    return this.httpService.httpPostObservable('product/create', {
      ...obj
    });
  }

  updateProductById(obj: any, id: number) {
    return this.httpService.httpPostObservable('product/updateById' +
      this.httpService.encode({ id }), { ...obj });
  }

  updateProductStatusById(obj: any, id: number) {
    return this.httpService.httpPostObservable('product/updateStatusById' +
      this.httpService.encode({ id }), { ...obj });
  }

  updateProductDispatchById(obj: any, id: number) {
    return this.httpService.httpPostObservable('product/updateDispatchById' +
      this.httpService.encode({ id }), { ...obj });
  }

  deleteProductById(id: number) {
    return this.httpService.httpGetObservable('product/deleteById', {
      id
    });
  }

  getProductList(condition: SearchCondition) {
    return this.httpService.httpGetObservable('product/list', {
      ...condition
    });
  }

  setProductRentPrice(obj: any) {
    return this.httpService.httpPostObservable('product/updateRentPrice', {
      ...obj
    });
  }
}
