import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDeviceComponent } from './store-device.component';

describe('StoreDeviceComponent', () => {
  let component: StoreDeviceComponent;
  let fixture: ComponentFixture<StoreDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
