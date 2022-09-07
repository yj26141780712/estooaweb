import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCustomComponent } from './message-custom.component';

describe('MessageCustomComponent', () => {
  let component: MessageCustomComponent;
  let fixture: ComponentFixture<MessageCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageCustomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
