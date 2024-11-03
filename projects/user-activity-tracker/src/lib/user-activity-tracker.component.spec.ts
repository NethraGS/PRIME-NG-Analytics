import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActivityTrackerComponent } from './user-activity-tracker.component';

describe('UserActivityTrackerComponent', () => {
  let component: UserActivityTrackerComponent;
  let fixture: ComponentFixture<UserActivityTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserActivityTrackerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserActivityTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
