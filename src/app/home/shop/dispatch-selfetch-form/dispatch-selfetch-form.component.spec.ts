import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchSelfetchFormComponent } from './dispatch-selfetch-form.component';

describe('DispatchSelfetchFormComponent', () => {
  let component: DispatchSelfetchFormComponent;
  let fixture: ComponentFixture<DispatchSelfetchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchSelfetchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchSelfetchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
