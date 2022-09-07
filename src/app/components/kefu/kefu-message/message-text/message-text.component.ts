import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { KMessage } from '../../kefu.service';
import { decodeText } from '../../utils/decodeText';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';

@Component({
  selector: 'app-message-text',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './message-text.component.html'
})
export class MessageTextComponent implements OnInit {

  _payload: any;
  @Input() isMine: boolean = false;
  @Input()
  get payload() {
    return this._payload;
  }
  set payload(value: any) {
    if (value) {
      this.contentList = decodeText(value);
    }
    this._payload = value;
  }
  @Input() message!: KMessage;
  contentList: any[] = [];
  @ViewChild(MessageBubbleComponent) mb!: MessageBubbleComponent;
  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  update() {
    this.cdr.markForCheck();
    if (this.mb) {
      this.mb.update();
    }
  }
}
