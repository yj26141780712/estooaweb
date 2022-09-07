import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictTypeFormComponent } from './dict-type-form.component';

describe('DictTypeFormComponent', () => {
  let component: DictTypeFormComponent;
  let fixture: ComponentFixture<DictTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DictTypeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DictTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
