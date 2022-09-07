import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KefuSessionListComponent } from './kefu-session-list.component';

describe('KefuSessionListComponent', () => {
  let component: KefuSessionListComponent;
  let fixture: ComponentFixture<KefuSessionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KefuSessionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KefuSessionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
