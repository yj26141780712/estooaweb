import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsManagerFormComponent } from './cs-manager-form.component';

describe('CsManagerFormComponent', () => {
  let component: CsManagerFormComponent;
  let fixture: ComponentFixture<CsManagerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsManagerFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsManagerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
