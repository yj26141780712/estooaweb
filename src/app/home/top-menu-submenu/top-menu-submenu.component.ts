import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[app-top-menu-submenu]',
  templateUrl: './top-menu-submenu.component.html',
  styleUrls: ['./top-menu-submenu.component.less']
})
export class TopMenuSubmenuComponent implements OnInit {

  @Input() menu: any;
  constructor() { }

  ngOnInit(): void {
  }

}
