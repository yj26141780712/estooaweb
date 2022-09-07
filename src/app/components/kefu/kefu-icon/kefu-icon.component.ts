import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { fromEvent } from 'rxjs';
import { KefuService } from '../kefu.service';

@Component({
  selector: 'app-kefu-icon',
  templateUrl: './kefu-icon.component.html',
  styleUrls: ['./kefu-icon.component.scss']
})
export class KefuIconComponent implements OnInit {

  constructor(private render: Renderer2,
    private el: ElementRef,
    private kefuService: KefuService) {
    this.render.addClass(this.el.nativeElement, 'kefu-icon');
    fromEvent(this.el.nativeElement, 'click')
      .subscribe(() => {
        this.kefuService.openForm();
      });
  }

  ngOnInit(): void {
  }

}
