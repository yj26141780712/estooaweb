import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictDataComponent } from './dict-data.component';

describe('DictDataComponent', () => {
  let component: DictDataComponent;
  let fixture: ComponentFixture<DictDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DictDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DictDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
