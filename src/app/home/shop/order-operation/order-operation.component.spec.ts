import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderOperationComponent } from './order-operation.component';

describe('OrderOperationComponent', () => {
  let component: OrderOperationComponent;
  let fixture: ComponentFixture<OrderOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderOperationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
