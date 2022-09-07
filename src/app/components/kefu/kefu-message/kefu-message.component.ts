import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { format } from 'date-fns';
import { TimTypes } from 'src/app/services/im.service';
import { KefuService, KMessage } from '../kefu.service';
import { MessageFileComponent } from './message-file/message-file.component';
import { MessageImageComponent } from './message-image/message-image.component';
import { MessageTextComponent } from './message-text/message-text.component';
import { MessageVideoComponent } from './message-video/message-video.component';

type messageType = MessageTextComponent | MessageFileComponent | MessageImageComponent | MessageVideoComponent

@Component({
  selector: 'app-kefu-message',
  templateUrl: './kefu-message.component.html',
})
export class KefuMessageComponent implements OnInit {

  @Input() message!: KMessage;
  types = TimTypes;
  @ViewChild('child') child!: messageType;
  get showAvatar() {
    if (this.kefuService.currentConversation.type === 'C2C' && !this.message.isRevoked) { // C2C且没有撤回的消息
      return true
    } else if (this.kefuService.currentConversation.type === 'GROUP' && !this.message.isRevoked) { // group且没有撤回的消息
      return this.message.type !== this.kefuService.timTypes.MSG_GRP_TIP
    }
    return false
  }

  getClass() {
    if (['TIMGroupTipElem', 'TIMGroupSystemNoticeElem'].includes(this.message.type)) {
      return 'position-center';
    }
    if (this.message.isRevoked) {
      return 'position-center';
    }
    if (this.isMine()) {
      return 'position-right';
    } else {
      return 'position-left';
    }
  }

  getBaseClass() {
    if (this.isMine()) {
      return 'right';
    } else {
      return 'left';
    }
  }

  isMine() {
    return this.message?.flow === 'out';
  }

  converTime(time: number) {
    return time ? format(time * 1000, "yyyy-MM-dd HH:mm:ss") : '';
  }

  constructor(private el: ElementRef,
    private render: Renderer2,
    private cdr: ChangeDetectorRef,
    private kefuService: KefuService) {
    this.render.addClass(this.el.nativeElement, 'kefu-message');
  }

  ngOnInit(): void {
    this.message.onSendCompleted = this.onSendCompleted;
    this.message.onRead = this.onRead;
  }

  onSendCompleted = () => {
    console.log('消息发送完毕');
    this.cdr.markForCheck();
    if (this.child) {
      
      this.child.update();
    }
  }

  onRead = () => {
    this.cdr.markForCheck();
    if (this.child) {
      this.child.update();
    }
  }
}
