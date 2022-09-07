import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressFormComponent } from './express-form.component';

describe('ExpressFormComponent', () => {
  let component: ExpressFormComponent;
  let fixture: ComponentFixture<ExpressFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpressFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
