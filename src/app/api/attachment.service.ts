import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from '../services/http.service';
import { SearchCondition } from '../types/search-conditon';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  refreshAttachmentList$ = new Subject<void>();
  constructor(private httpService: HttpService) { }

  refreshAttachmentList() {
    this.refreshAttachmentList$.next();
  }

  uploadAttachment(formData: FormData) {
    return this.httpService.httpPostFormData('attachment/upload', formData);
  }

  updateAttachment(obj: any, id: number) {
    return this.httpService.httpPostFormData('attachment/update' +
      this.httpService.encode({ id }), {
      ...obj
    });
  }

  getAttachmentTypeList() {
    return this.httpService.httpGetObservable('attachment/typeList', {
    });
  }

  getAttachmentList(condition: SearchCondition) {
    return this.httpService.httpGetObservable('attachment/list', {
      ...condition
    });
  }
}
