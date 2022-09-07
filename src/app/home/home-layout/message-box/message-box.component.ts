import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.less'],
})
export class MessageBoxComponent implements OnInit {

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.renderer.addClass(this.el.nativeElement, 'home-message-box');
  }

  ngOnInit(): void {
  }

}
