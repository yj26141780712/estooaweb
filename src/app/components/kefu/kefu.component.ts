import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { KefuFormComponent } from './kefu-form/kefu-form.component';
import { KefuService } from './kefu.service';

@Component({
  selector: 'app-kefu',
  // preserveWhitespaces: false,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.None,
  templateUrl: './kefu.component.html',
})
export class KefuComponent implements OnInit, OnDestroy, OnChanges {

  destroy$ = new Subject<void>();
  show = false;
  modal: any;
  @ViewChild('kefu') kefu!: KefuFormComponent;
  @Input() hidden!: boolean;
  constructor(private render: Renderer2,
    private el: ElementRef,
    private kefuService: KefuService) {
    this.render.addClass(this.el.nativeElement, 'kefu');
    this.kefuService.operation$.pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res.type === 'requestSuccess') {
          this.requestSuccess(res.data);
        }
      })
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    const { hidden } = changes;
    if (hidden.currentValue === false) {
      this.kefuService.setCurrentConversationMessageRead();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  requestSuccess(userId: string) {

  }


  deal(data: any) {
    const fun = (this as any)[data.type];
    if (fun) {
      (this as any)[data.type](data);
    }
  }

  onEventCustomerService = async (data: any) => {
    console.log(data);
  }
}
