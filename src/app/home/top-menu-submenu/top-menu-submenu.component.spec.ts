import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMenuSubmenuComponent } from './top-menu-submenu.component';

describe('TopMenuSubmenuComponent', () => {
  let component: TopMenuSubmenuComponent;
  let fixture: ComponentFixture<TopMenuSubmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopMenuSubmenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopMenuSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
