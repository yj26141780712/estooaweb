import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictTypeComponent } from './dict-type.component';

describe('DictTypeComponent', () => {
  let component: DictTypeComponent;
  let fixture: ComponentFixture<DictTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DictTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DictTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
