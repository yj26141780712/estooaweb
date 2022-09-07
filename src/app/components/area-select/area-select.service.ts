import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpService } from 'src/app/services/http.service';
import { AreaSelectComponent } from './area-select/area-select.component';


@Injectable()
export class AreaSelectService {

  constructor(private modalService: NzModalService,
    private httpService: HttpService) { }


  getChinaCitySelect() {
    return this.httpService.httpGetObservable('baseinfo/city', {});
  }

  openSelect(callback?: (arr: any[]) => void, options?: any) {
    this.modalService.create({
      nzTitle: '选择区域',
      nzContent: AreaSelectComponent,
      nzWidth: 800,
      nzFooter: null,
      nzBodyStyle: {
        'padding': '0'
      },
      nzComponentParams: {
        callback
      }
    });
  }
}
