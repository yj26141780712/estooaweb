import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  selectedIndex = 0;
  menuItems: any[] = [
    { title: '基础设置' },
    { title: '操作日志' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  selectItem(e: MouseEvent, i: number) {
    e.stopPropagation();
    e.preventDefault();
    this.selectedIndex = i;
  }


}
