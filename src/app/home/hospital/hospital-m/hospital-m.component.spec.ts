import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalMComponent } from './hospital-m.component';

describe('HospitalMComponent', () => {
  let component: HospitalMComponent;
  let fixture: ComponentFixture<HospitalMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
