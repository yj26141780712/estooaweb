import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchFormComponent } from './dispatch-form.component';

describe('DispatchFormComponent', () => {
  let component: DispatchFormComponent;
  let fixture: ComponentFixture<DispatchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
