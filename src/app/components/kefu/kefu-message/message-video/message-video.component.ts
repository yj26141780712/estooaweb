import { ChangeDetectorRef, Component, ViewChild, Input, OnInit } from '@angular/core';
import { KefuService, KMessage } from '../../kefu.service';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';

@Component({
  selector: 'app-message-video',
  templateUrl: './message-video.component.html',
  styleUrls: ['./message-video.component.scss']
})
export class MessageVideoComponent implements OnInit {

  @Input() isMine: boolean = false;
  @Input() payload: any;
  @Input() message!: KMessage;
  @ViewChild(MessageBubbleComponent) mb!: MessageBubbleComponent;
  constructor(private cdr: ChangeDetectorRef,
    private kefuService: KefuService) { }

  ngOnInit(): void {
    this.message.onProgress = this.onProgress;
  }

  onProgress = (precent: number) => {
    this.message.progress = precent * 100;
    this.cdr.markForCheck();
  }

  onError(e: any) {
    console.log(e);
  }

  onImageLoad() {
    console.log('视频加载完毕！');
    this.kefuService.imageLoad$.next();
  }

  update() {
    this.cdr.markForCheck();
    if (this.mb) {
      this.mb.update();
    }
  }
}
