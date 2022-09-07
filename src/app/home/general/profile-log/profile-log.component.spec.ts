import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLogComponent } from './profile-log.component';

describe('ProfileLogComponent', () => {
  let component: ProfileLogComponent;
  let fixture: ComponentFixture<ProfileLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
