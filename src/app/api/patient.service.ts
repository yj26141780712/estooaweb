import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from '../services/http.service';
import { SearchCondition } from '../types/search-conditon';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  refreshPatientList$ = new Subject();
  constructor(private httpService: HttpService) { }

  getPatientList(condition: SearchCondition) {
    return this.httpService.httpGetObservable('patient/list', {
      ...condition
    });
  }

}
