import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from '../services/http.service';
import { SearchCondition } from '../types/search-conditon';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  refreshModelList$ = new Subject();
  refreshDeviceList$ = new Subject();
  refreshVideoList$ = new Subject();
  constructor(private httpService: HttpService) { }

  refreshModelList() {
    this.refreshModelList$.next('');
  }

  createModel(obj: any) {
    return this.httpService.httpPostObservable('device/createModel', {
      ...obj
    });
  }

  updateModelById(obj: any, id: number) {
    return this.httpService.httpPostObservable('device/updateModelById' +
      this.httpService.encode({ id }), {
      ...obj
    })
  }

  updateModelDescById(formData: FormData, id: number) {
    return this.httpService.httpPostFormData('device/updateModelDescById' +
      this.httpService.encode({ id }), formData)
  }

  deleteModelById(id: number) {
    return this.httpService.httpGetObservable('device/deleteModelById', {
      id
    })
  }

  getModelList(condition: SearchCondition) {
    return this.httpService.httpGetObservable('device/modelList', {
      ...condition
    });
  }

  refreshDeviceList() {
    this.refreshDeviceList$.next('');
  }

  createDevice(obj: any) {
    return this.httpService.httpPostObservable('device/create', { ...obj });
  }

  updateDeviceById(obj: any, id: number) {
    return this.httpService.httpPostObservable('device/updateById' +
      this.httpService.encode({ id }), {
      ...obj
    });
  }

  deleteDeviceById(id: number) {
    return this.httpService.httpGetObservable('device/deleteById', {
      id
    });
  }

  getDeviceList(condition: SearchCondition) {
    return this.httpService.httpGetObservable('device/list', {
      ...condition
    });
  }

  createVideo(formData: FormData) {
    return this.httpService.httpPostFormData('device/createVideo', formData);
  }

  updateVideoById(formData: FormData, id: number) {
    return this.httpService.httpPostFormData('device/updateVideoById' +
      this.httpService.encode({ id }), formData);
  }

  deleteVideoById(id: number) {
    return this.httpService.httpGetObservable('device/deleteVideoById', {
      id
    });
  }

  getVideoList(condition: SearchCondition) {
    return this.httpService.httpGetObservable('device/videoList', {
      ...condition
    });
  }

  refreshVideoList() {
    this.refreshVideoList$.next('');
  }
}
