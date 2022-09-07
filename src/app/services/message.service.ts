import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private messageService: NzMessageService) {
  }

  success(msg: string) {
    this.messageService.success(msg);
  }

  info(msg: string) {
    this.messageService.info(msg);
  }

  error(msg: string) {
    this.messageService.error(msg);
  }

  warning(msg: string) {
    this.messageService.warning(msg);
  }
}
