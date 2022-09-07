import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from '../services/http.service';
import { SearchCondition } from '../types/search-conditon';

@Injectable({
  providedIn: 'root'
})
export class InformationService {

  refreshInformationList$ = new Subject();
  constructor(private httpService: HttpService) {

  }

  refreshInformationList() {
    this.refreshInformationList$.next('');
  }

  createInformation(formData: FormData) {
    return this.httpService.httpPostFormData('information/create', formData);
  }

  updateInformationById(formData: FormData, id: number) {
    return this.httpService.httpPostFormData('information/updateById' +
      this.httpService.encode({ id }), formData);
  }

  deleteInformationById(id: number) {
    return this.httpService.httpGetObservable('information/deleteById', {
      id
    });
  }

  getInformationList(condition: SearchCondition) {
    return this.httpService.httpGetObservable('information/list', {
      ...condition
    });
  }
}
