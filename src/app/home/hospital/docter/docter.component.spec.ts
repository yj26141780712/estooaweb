import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocterComponent } from './docter.component';

describe('DocterComponent', () => {
  let component: DocterComponent;
  let fixture: ComponentFixture<DocterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
