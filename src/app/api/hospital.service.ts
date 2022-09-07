import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from '../services/http.service';
import { SearchCondition } from '../types/search-conditon';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  refreshHospital$ = new Subject();
  constructor(private httpService: HttpService) { }

  refreshHospitalList() {
    this.refreshHospital$.next('');
  }

  createHospital(obj: FormData) {
    return this.httpService.httpPostFormData('hospital/create', obj);
  }

  updateHospitalById(obj: FormData, id: number) {
    return this.httpService.httpPostFormData('hospital/updateById' +
      this.httpService.encode({ id }), obj);
  }

  deleteHospitalById(id: number) {
    return this.httpService.httpGetObservable('hospital/deleteById', {
      id
    });
  }

  getHospitalList(query: SearchCondition) {
    return this.httpService.httpGetObservable('hospital/list', {
      ...query
    });
  }

  getHospitalSelectList() {
    return this.httpService.httpGetObservable('hospital/selectList', {});
  }
}
