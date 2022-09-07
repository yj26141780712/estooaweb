import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { KefuService, KSession, sessionStatusType } from 'src/app/components/kefu/kefu.service';
import { KefuSessionListComponent } from '../kefu-session-list/kefu-session-list.component';

@Component({
  selector: 'app-kefu-form',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './kefu-form.component.html',
})
export class KefuFormComponent implements OnInit, OnDestroy {

  info: any;//客服信息
  conversationID = '';
  messageList: any[] = [];
  isCompleted = false;
  statuss = [
    { value: 'online', label: '在线' },
    { value: 'offline', label: '离开' },
    { value: 'busy', label: '忙碌' }
  ]
  sessionStatus: sessionStatusType = 'online';
  isNoSession = true;
  destroy$ = new Subject<void>();
  @ViewChild('sessionList') sessionList!: KefuSessionListComponent;

  get onlines() {
    return this.kefuService.sessions.filter(x => x.type === 'online');
  }

  get waitings() {
    return this.kefuService.sessions.filter(x => x.type === 'waiting');
  }

  get histories() {
    return this.kefuService.sessions.filter(x => x.type === 'history');
  }


  get onlineNoReadCount() {
    return this.onlines.filter(x => x.conversation && x.conversation.conversationID !== this.kefuService.currentConversation.conversationID && x.conversation.unreadCount > 0).length;
  }

  get waitingNoReadCount() {
    return this.waitings.filter(x => x.conversation && x.conversation.conversationID !== this.kefuService.currentConversation.conversationID && x.conversation.unreadCount > 0).length;
  }

  get historyNoReadCount() {
    return this.histories.filter(x => x.conversation && x.conversation.conversationID !== this.kefuService.currentConversation.conversationID && x.conversation.unreadCount > 0).length;
  }

  constructor(private el: ElementRef,
    private render: Renderer2,
    private cdr: ChangeDetectorRef,
    private modalService: NzModalService,
    public kefuService: KefuService) {
    this.render.addClass(this.el.nativeElement, 'kefu-form-bg');
    this.hide();
  }

  ngOnInit(): void {
    fromEvent<MouseEvent>(this.el.nativeElement, 'click').pipe(takeUntil(this.destroy$))
      .subscribe(e => {
        const className = (e.target as any).classList[0];
        if (className === 'kefu-form-bg') {
          this.hide();
        }
      });
    this.kefuService.openform$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.show();
    })
    this.kefuService.closeform$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.hide();
    });
    this.kefuService.updateInfo$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.info = this.kefuService.info;
      this.cdr.markForCheck();
    });
    this.kefuService.updateSessionList$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.sessionList!.update();
      this.cdr.markForCheck();
    });
    this.kefuService.updateMessageList$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.messageList = this.kefuService.currentMessageList;
      this.isCompleted = this.kefuService.isCompleted;
      this.cdr.markForCheck();
      this.kefuService.setCurrentConversationMessageRead();
    });
    this.kefuService.updateCurrentSession$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.messageList = this.kefuService.currentMessageList;
      console.log(this.messageList);
      this.isCompleted = this.kefuService.isCompleted;
      this.conversationID = this.kefuService.currentConversation.conversationID || '';
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  hide() {
    this.render.setStyle(this.el.nativeElement, 'display', 'none');
  }

  show() {
    this.render.setStyle(this.el.nativeElement, 'display', 'flex');
  }

  switchUserStatus(status: string) {
    console.log('切换客服状态', status);
  }

  changeSessionStatus(status: sessionStatusType) {
    this.sessionStatus = status;
    this.kefuService.resetSession();
  }

  close() {
    this.hide();
  }

  onSelect = (session: KSession) => {
    this.kefuService.selectSession(session);
  }

  onOnlineClose = (session: KSession) => {
    this.modalService.confirm({
      nzTitle: '确定要结束这个会话?',
      nzOnOk: () => {
        this.kefuService.closeSession(session);
      }
    });
  }

  onWaitingClose = (session: KSession) => {
    console.log('删除等待回话');
  }

  onHistoryClose = (session: KSession) => {
    this.modalService.confirm({
      nzTitle: '确定要删除这个会话?',
      nzOnOk: () => {
        this.kefuService.deleteSession(session);
      }
    });
  }

  waitingAdd = (session: KSession) => {
    this.modalService.confirm({
      nzTitle: '确定要加入会话中列表?',
      nzOnOk: () => {
        this.kefuService.addOnlines(session);
      }
    });
  }

  historyAdd = (session: KSession) => {
    this.modalService.confirm({
      nzTitle: '确定要加入会话中列表?',
      nzOnOk: () => {
        this.kefuService.addOnlines(session);
      }
    });
  }
}
