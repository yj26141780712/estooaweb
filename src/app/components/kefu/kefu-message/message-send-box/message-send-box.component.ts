import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { ENTER, CONTROL } from '@angular/cdk/keycodes';
import { KefuService } from '../../kefu.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { emojiMap, emojiName, emojiUrl } from '../../utils/emojiMap';

@Component({
  selector: 'app-message-send-box',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './message-send-box.component.html'
})
export class MessageSendBoxComponent implements OnInit, AfterViewInit, OnDestroy {

  visible = false;
  message = '';
  isCtrlPress = false;
  @ViewChild('input') inputEl!: ElementRef;
  @ViewChild('img') imgEl!: ElementRef;
  @ViewChild('video') videoEl!: ElementRef;
  @ViewChild('file') fileEl!: ElementRef;
  destroy$ = new Subject<void>();
  emojiName = emojiName;

  emojiUrl(item: string) {
    return `${emojiUrl}${emojiMap[item]}`
  }

  constructor(private el: ElementRef,
    private render: Renderer2,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private kefuService: KefuService,
    private messageService: NzMessageService) {
    this.render.addClass(this.el.nativeElement, 'message-send-box');
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent<KeyboardEvent>(this.inputEl.nativeElement, 'keydown')
        .subscribe((e: KeyboardEvent) => {
          const keyCode = e.keyCode;
          if (keyCode !== ENTER && keyCode !== CONTROL) {
            return;
          }
          e.preventDefault();
          if (keyCode === CONTROL) {
            this.ngZone.run(() => {
              this.isCtrlPress = true;
            });
          } else if (keyCode === ENTER) {
            if (!this.isCtrlPress) {
              this.ngZone.run(() => {
                this.handleEnter();
              });
            }
          }
        });
      fromEvent<KeyboardEvent>(this.inputEl.nativeElement, 'keyup')
        .subscribe((e: KeyboardEvent) => {
          const keyCode = e.keyCode;
          if (keyCode !== ENTER && keyCode !== CONTROL) {
            return;
          }
          e.preventDefault();
          if (keyCode === CONTROL) {
            this.ngZone.run(() => {
              this.isCtrlPress = false;
            });
          } else if (keyCode === ENTER) {
            this.ngZone.run(() => {
              if (this.isCtrlPress) {
                this.handleLine();
              }
            })
          }
        });
      fromEvent<MouseEvent>(this.imgEl.nativeElement, 'change')
        .subscribe((e: MouseEvent) => {

        });
      fromEvent<MouseEvent>(this.fileEl.nativeElement, 'change')
        .subscribe((e: MouseEvent) => {

        });
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleEnter() {
    console.log('发送');
    this.sendMessage();
  }

  handleLine() {
    console.log('换行');
    this.message += '\n';
    this.cdr.markForCheck();
  }

  chooseEmoji(item: string) {
    console.log(item);
    this.message += item;
  }

  sendMessage() {
    if (!this.message) {
      this.messageService.error('不能发送空消息！');
      return;
    }
    this.kefuService.sendTextMessage(this.message);
    this.message = '';
    this.cdr.markForCheck();
  }

  handleSendImage() {
    this.imgEl.nativeElement.click();
  }

  handleSendVideo() {
    this.videoEl.nativeElement.click();
  }

  handleSendFile() {
    this.fileEl.nativeElement.click();
  }

  sendImage() {
    this.kefuService.sendImageMessage(this.imgEl.nativeElement);
  }

  sendVideo() {
    this.kefuService.sendVideoMessage(this.videoEl.nativeElement);
  }

  sendFile() {
    this.kefuService.sendFileMessage(this.fileEl.nativeElement);
  }
}
