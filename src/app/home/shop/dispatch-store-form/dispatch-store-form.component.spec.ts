import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchStoreFormComponent } from './dispatch-store-form.component';

describe('DispatchStoreFormComponent', () => {
  let component: DispatchStoreFormComponent;
  let fixture: ComponentFixture<DispatchStoreFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchStoreFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchStoreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
