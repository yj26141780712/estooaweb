import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { downloadHasFetch } from 'src/app/utils/download';
import { KMessage } from '../../kefu.service';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';

@Component({
  selector: 'app-message-file',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './message-file.component.html'
})
export class MessageFileComponent implements OnInit {

  @Input() isMine: boolean = false;
  @Input() payload: any;
  @Input() message!: KMessage;
  @ViewChild(MessageBubbleComponent) mb!: MessageBubbleComponent;
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.message.onProgress = this.onProgress;
  }

  onProgress = (precent: number) => {
    this.message.progress = precent * 100;
    this.cdr.markForCheck();
  }

  download() {
    downloadHasFetch(this.message.payload.fileUrl, this.message.payload.fileName);
  }

  update() {
    console.log(this.message.status);
    this.cdr.markForCheck();
    if (this.mb) {
      this.mb.update();
    }
  }
}
