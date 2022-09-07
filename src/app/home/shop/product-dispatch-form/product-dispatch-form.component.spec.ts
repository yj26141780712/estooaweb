import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDispatchFormComponent } from './product-dispatch-form.component';

describe('ProductDispatchFormComponent', () => {
  let component: ProductDispatchFormComponent;
  let fixture: ComponentFixture<ProductDispatchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDispatchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDispatchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
