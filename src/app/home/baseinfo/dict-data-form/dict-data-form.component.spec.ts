import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictDataFormComponent } from './dict-data-form.component';

describe('DictDataFormComponent', () => {
  let component: DictDataFormComponent;
  let fixture: ComponentFixture<DictDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DictDataFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DictDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
