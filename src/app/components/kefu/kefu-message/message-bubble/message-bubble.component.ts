import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { KefuService, KMessage } from '../../kefu.service';

@Component({
  selector: 'app-message-bubble',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './message-bubble.component.html',
})
export class MessageBubbleComponent implements OnInit {

  @Input() isMine: boolean = false;
  @Input() message!: KMessage;
  constructor(private el: ElementRef,
    private render: Renderer2,
    private cdr: ChangeDetectorRef,
    private kefuService: KefuService) {
    this.render.addClass(this.el.nativeElement, 'message-bubble');
  }

  getClass() {
    if (this.isMine) {
      return 'message-send';
    } else {
      return 'message-received';
    }
  }

  get text() {
    if (
      this.message.conversationType === this.kefuService.timTypes.CONV_C2C &&
      !this.isMine
    ) {
      return "对方撤回了一条消息";
    }
    if (
      this.message.conversationType === this.kefuService.timTypes.CONV_GROUP &&
      !this.isMine
    ) {
      return `${this.message.from}撤回了一条消息`;
    }
    return "你撤回了一条消息";
  }

  get messageReadByPeer() {
    if (this.message.status !== "success") {
      return false;
    }
    if (
      this.message.conversationType === this.kefuService.timTypes.CONV_C2C &&
      this.message.isPeerRead
    ) {
      return "已读";
    }
    if (
      this.message.conversationType === this.kefuService.timTypes.CONV_C2C &&
      !this.message.isPeerRead
    ) {
      return "未读";
    }
    return "";
  }

  ngOnInit(): void {
  }

  update() {
    this.cdr.markForCheck();
  }
}
