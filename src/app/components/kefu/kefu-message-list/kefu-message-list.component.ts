import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, QueryList, Renderer2, SimpleChanges, ViewChildren, ViewEncapsulation } from '@angular/core';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { KefuMessageComponent } from '../kefu-message/kefu-message.component';
import { KefuService, KMessage } from '../kefu.service';


@Component({
  selector: 'app-kefu-message-list',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './kefu-message-list.component.html',
})
export class KefuMessageListComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  preScrollHeight = 0;
  @Input() list!: KMessage[];
  @Input() isCompleted = false;
  destroy$ = new Subject<void>();
  isShowScrollButtomTip = false;
  @ViewChildren(KefuMessageComponent) messageList!: QueryList<KefuMessageComponent>;
  constructor(public el: ElementRef,
    private render: Renderer2,
    private cdr: ChangeDetectorRef,
    private kefuService: KefuService) {
    this.render.addClass(this.el.nativeElement, 'kefu-message-list');

  }

  ngOnInit(): void {
    this.kefuService.scrollToBottom$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.scrollToButtom();
      });
    fromEvent<any>(this.el.nativeElement, 'scroll')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ target: { scrollTop } }) => {
        if (this.preScrollHeight - this.el.nativeElement.clientHeight - scrollTop < 20) {
          this.isShowScrollButtomTip = false;
        }
      })
    this.kefuService.imageLoad$.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.keepScrollButtom();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { list } = changes;
    if (list.currentValue !== list.previousValue) {
      setTimeout(() => {
        this.keepScrollButtom();
      });
    }
  }

  ngAfterViewInit(): void {
    console.log('viewinit')
    this.scrollToButtom();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  keepScrollButtom() {
    if (this.preScrollHeight - this.el.nativeElement.clientHeight - this.el.nativeElement.scrollTop < 20) {
      this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
      setTimeout(() => {
        this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
      });
      this.isShowScrollButtomTip = false;
    } else {
      this.isShowScrollButtomTip = true;
    }
    this.preScrollHeight = this.el.nativeElement.scrollHeight;
    this.cdr.markForCheck();
  }

  scrollToButtom() {
    setTimeout(() => {
      console.log('scrollToButtom', this.el.nativeElement.scrollTop, this.el.nativeElement.scrollHeight);
      this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
      this.preScrollHeight = this.el.nativeElement.scrollHeight;
      this.isShowScrollButtomTip = false;
      this.cdr.markForCheck();
    });
  }

  getMore() {
    this.kefuService.getMessageList();
  }

}
