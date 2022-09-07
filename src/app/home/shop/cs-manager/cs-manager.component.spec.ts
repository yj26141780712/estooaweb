import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsManagerComponent } from './cs-manager.component';

describe('CsManagerComponent', () => {
  let component: CsManagerComponent;
  let fixture: ComponentFixture<CsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
