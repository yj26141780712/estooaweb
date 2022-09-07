import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Output, QueryList, Renderer2, ViewChildren, ViewEncapsulation } from '@angular/core';
import { KefuSessionComponent } from '../kefu-session/kefu-session.component';
import { KConversation, KSession } from '../kefu.service';

@Component({
  selector: 'app-kefu-session-list',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './kefu-session-list.component.html'
})
export class KefuSessionListComponent implements OnInit {

  @Input() list!: KSession[];
  @Input() conversationID!: string;
  @Input() conversation!: KConversation;
  @Input() showAdd = false;
  @Input() onSelect = (data: any) => { };
  @Input() onClose = (data: any) => { };
  @Input() onAdd = (data: any) => { };
  @ViewChildren(KefuSessionComponent) kefuSessionList!: QueryList<KefuSessionComponent>;
  constructor(private el: ElementRef,
    private render: Renderer2,
    private cdr: ChangeDetectorRef) {
    this.render.addClass(this.el.nativeElement, 'kefu-session-list');
  }

  ngOnInit(): void {
  }

  update() {
    this.cdr.markForCheck();
    this.kefuSessionList.forEach(x => {
      x.update();
    });
  }
}
