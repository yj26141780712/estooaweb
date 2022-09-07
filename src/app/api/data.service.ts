import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpService: HttpService) { }

  getDataIndex(stime: string, etime: string) {
    return this.httpService.httpGetObservable('data/index', {
      stime,
      etime
    });
  }
}
