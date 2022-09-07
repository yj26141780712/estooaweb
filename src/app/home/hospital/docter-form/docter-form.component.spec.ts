import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocterFormComponent } from './docter-form.component';

describe('DocterFormComponent', () => {
  let component: DocterFormComponent;
  let fixture: ComponentFixture<DocterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
