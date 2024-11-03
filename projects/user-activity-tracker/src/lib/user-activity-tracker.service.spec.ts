import { TestBed } from '@angular/core/testing';

import { UserActivityTrackerService } from './user-activity-tracker.service';

describe('UserActivityTrackerService', () => {
  let service: UserActivityTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserActivityTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
