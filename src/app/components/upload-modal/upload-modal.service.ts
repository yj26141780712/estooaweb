import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SelectFormComponent } from './select-form/select-form.component';

export interface SelectFile {
  id: number;
  url: string;
  [key: string]: any;
}

export interface SelectFileOption {
  multiple: boolean
  [key: string]: any;
}

@Injectable()
export class UploadModalService {

  constructor(private modalService: NzModalService) { }

  openSelect(callback?: (imgs: SelectFile[]) => void, options?: SelectFileOption) {
    this.modalService.create({
      nzTitle: '选择图片',
      nzContent: SelectFormComponent,
      nzWidth: 800,
      nzFooter: null,
      nzBodyStyle: {
        'padding': '0'
      },
      nzComponentParams: {
        callback,
        multiple: options?.multiple
      }
    });
  }
}
