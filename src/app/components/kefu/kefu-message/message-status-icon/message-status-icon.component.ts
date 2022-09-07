import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { KefuService, KMessage } from '../../kefu.service';

@Component({
  selector: 'app-message-status-icon',
  templateUrl: './message-status-icon.component.html'
})
export class MessageStatusIconComponent implements OnInit {

  @Input() message!: KMessage;
  constructor(private el: ElementRef,
    private render: Renderer2,
    private kefuService: KefuService) {
    this.render.addClass(this.el.nativeElement, 'message-status-icon');
  }

  ngOnInit(): void {
    console.log(this.message.status);
  }

  reSend() {
    if (this.message.status === 'fail') {
      this.kefuService.reSendMessage(this.message);
    }
  }
}
