import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { KefuService, KMessage } from '../../kefu.service';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';

@Component({
  selector: 'app-message-image',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './message-image.component.html'
})
export class MessageImageComponent implements OnInit {

  @Input() isMine: boolean = false;
  @Input() payload: any;
  @Input() message!: KMessage;
  @ViewChild(MessageBubbleComponent) mb!: MessageBubbleComponent;
  getImageUrl() {
    const url = this.payload.imageInfoArray[0].url;
    if (typeof url !== 'string') {
      return '';
    }
    return url.slice(0, 2) === '//' ? `https:${url}` : url;
  }

  constructor(private cdr: ChangeDetectorRef,
    private kefuService: KefuService) { }

  ngOnInit(): void {
    this.message.onProgress = this.onProgress;
  }

  onProgress = (precent: number) => {
    this.message.progress = precent * 100;
    this.cdr.markForCheck();
  }

  // onSendCompleted = () => {
  //   this.cdr.markForCheck();
  // }

  onImageLoad() {
    console.log('图片加载完毕！')
    this.kefuService.imageLoad$.next();
  }

  update() {
    this.cdr.markForCheck();
    if (this.mb) {
      this.mb.update();
    }
  }

}
