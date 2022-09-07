import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from '../services/http.service';
import { SearchCondition } from '../types/search-conditon';

@Injectable({
  providedIn: 'root'
})
export class DocterService {

  refreshDocterList$ = new Subject();
  constructor(private httpService: HttpService) { }

  refreshDocterList() {
    this.refreshDocterList$.next('');
  }

  createDocter(data: FormData) {
    return this.httpService.httpPostFormData('docter/create', data);
  }

  updateDocterById(data: FormData, id: number) {
    return this.httpService.httpPostFormData('docter/updateById' +
      this.httpService.encode({ id }), data);
  }

  deleteDocterById(id: number) {
    return this.httpService.httpGetObservable('docter/deleteById', {
      id
    });
  }

  getDocterList(condition: SearchCondition) {
    return this.httpService.httpGetObservable('docter/list', {
      ...condition
    });
  }
}
