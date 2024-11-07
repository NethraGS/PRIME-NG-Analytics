import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _userRole: string | null = null;
  private _userId: string | null = null;
  sessionId: string | null = null;
  sessionStartTime: number | null = null;

  constructor(private cookieService: CookieService) {}

  set userRole(role: string | null) {
    this._userRole = role;
  }

  get userRole(): string | null {
    return this._userRole;
  }

  set userId(id: string | null) {
    this._userId = id;
  }

  get userId(): string | null {
    return this._userId;
  }

  get isAuthenticated(): boolean {
    return !!this._userId;  
  }

 
  generateSessionId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);  
  }

  // Start a new session
  startSession() {
    if (!this.sessionId) {
      this.sessionId = this.generateSessionId(); 
      this.sessionStartTime = Date.now(); 
      sessionStorage.setItem('sessionId', this.sessionId);  
      sessionStorage.setItem('sessionStartTime', this.sessionStartTime.toString());  // Store start time
      this.cookieService.set('sessionId', this.sessionId); // Also store session ID in cookies
      this.cookieService.set('sessionStartTime', this.sessionStartTime.toString());  // Store start time in cookies
    }
  }

  // End the session
  endSession() {
    if (this.sessionId && this.sessionStartTime) {
      const sessionDuration = Date.now() - this.sessionStartTime;
      sessionStorage.setItem('sessionDuration', sessionDuration.toString());  // Store session duration
      this.cookieService.set('sessionDuration', sessionDuration.toString());  // Store session duration in cookies
      this.sessionId = null;
      this.sessionStartTime = null;
      sessionStorage.removeItem('sessionId');  // Remove from sessionStorage
      sessionStorage.removeItem('sessionStartTime');  // Remove from sessionStorage
      this.cookieService.delete('sessionId');  // Remove from cookies
      this.cookieService.delete('sessionStartTime');  // Remove from cookies
    }
  }

  // Logout the user
  logout() {
    this._userId = null;
    this._userRole = null;
    this.endSession(); // End the session
    this.cookieService.delete('authToken'); // Clear auth token in cookies
    sessionStorage.removeItem('authToken');  // Remove auth token from sessionStorage
  }
}
