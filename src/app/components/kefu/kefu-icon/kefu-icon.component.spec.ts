import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KefuIconComponent } from './kefu-icon.component';

describe('KefuIconComponent', () => {
  let component: KefuIconComponent;
  let fixture: ComponentFixture<KefuIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KefuIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KefuIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
