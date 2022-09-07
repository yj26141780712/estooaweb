import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRentPriceFormComponent } from './product-rent-price-form.component';

describe('ProductRentPriceFormComponent', () => {
  let component: ProductRentPriceFormComponent;
  let fixture: ComponentFixture<ProductRentPriceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductRentPriceFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRentPriceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
