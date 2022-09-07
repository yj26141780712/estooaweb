import { I } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { format } from 'date-fns';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { KefuService, KMessage, KSession, KSessionUser } from '../kefu.service';

@Component({
  selector: 'app-kefu-session',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './kefu-session.component.html'
})
export class KefuSessionComponent implements OnInit {

  @Input() session!: KSession;
  @Input() showAdd = false;
  @Output() onSelect = new EventEmitter();
  @Output() onClose = new EventEmitter()
  @Output() onAdd = new EventEmitter()
  destroy$ = new Subject<void>();

  get avatar() {
    const conversation = this.session.conversation;
    if (conversation) {
      return conversation.userProfile.avatar;
    } else {
      return '';
    }
  }

  get title() {
    const conversation = this.session.conversation;
    if (conversation) {
      return conversation.userProfile.nick || conversation.userProfile.userID;
    } else {
      return this.session.user.userId;
    }
  }

  get MessageForShow() {
    const conversation = this.session.conversation;
    if (!conversation) {
      return '';
    }
    if (conversation.lastMessage.isRevoked) {
      if (conversation.lastMessage.fromAccount === conversation.userID) {
        return '你撤回了一条消息'
      }
      if (conversation.type === this.kefuService.timTypes.CONV_C2C) {
        return '对方撤回了一条消息'
      }
      return `${conversation.lastMessage.fromAccount}撤回了一条消息`
    }
    return conversation.lastMessage.messageForShow
  }

  get lastTime() {
    const conversation = this.session.conversation;
    if (conversation) {
      return this.converTime(conversation.lastMessage.lastTime);
    }
    return '';
  }

  get showUnreadCount() {
    const conversation = this.session.conversation;
    if (conversation) {
      return this.kefuService.currentConversation.conversationID !== conversation.conversationID
        && conversation.unreadCount > 0;
    }
    return false;

  }

  get unreadCount() {
    const conversation = this.session.conversation;
    if (conversation) {
      return conversation.unreadCount > 99 ? '99+' : conversation.unreadCount
    }
    return 0;
  }

  converTime(value: number | undefined) {
    return value ? format(value * 1000, 'yyyy-MM-dd HH:mm') : ''
  }

  constructor(private el: ElementRef,
    private render: Renderer2,
    private cdr: ChangeDetectorRef,
    private kefuService: KefuService) {
    this.render.addClass(this.el.nativeElement, 'kefu-session')
    fromEvent(this.el.nativeElement, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onSelect.emit(this.session);
      });
  }

  ngOnInit(): void {
  }

  close(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.onClose.emit(this.session);
  }

  update() {
    this.cdr.markForCheck();
  }

  add(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.onAdd.emit(this.session);
  }
}
