// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserActivityTrackerService } from 'projects/user-activity-tracker/src/public-api';
import { UserService } from 'src/app/UserService';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService,
    private userActivityTracker: UserActivityTrackerService
  ) {}

  canActivate(): boolean {
    if (this.userService.isAuthenticated) {
      // Start session if authenticated
      this.userActivityTracker.trackSessionStart();
      return true;
    } else {
      // Redirect to login page if not authenticated
      this.router.navigate(['/login']);
      return false;
    }
  }

  // Call this on logout
  logout() {
    this.userActivityTracker.endSession(); // Ensure endSession is defined in UserActivityTrackerService
    this.userService.logout(); // Clear user session data
    this.router.navigate(['/login']); // Redirect to login after logout
  }
}
