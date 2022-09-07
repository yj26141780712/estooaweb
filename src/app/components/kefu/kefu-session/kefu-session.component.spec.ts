import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KefuSessionComponent } from './kefu-session.component';

describe('KefuSessionComponent', () => {
  let component: KefuSessionComponent;
  let fixture: ComponentFixture<KefuSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KefuSessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KefuSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
