import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _userRole: string | null = null;
  private _userId: string | null = null;
  sessionId: string | null = null;
  sessionStartTime: number | null = null;

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

 
  startSession() {
    if (!this.sessionId) {
      this.sessionId = this.generateSessionId();
      this.sessionStartTime = Date.now();
      sessionStorage.setItem('sessionId', this.sessionId);  
      sessionStorage.setItem('sessionStartTime', this.sessionStartTime.toString()); 
    }
  }

  // End the current session
  endSession() {
    if (this.sessionId && this.sessionStartTime) {
      const sessionDuration = Date.now() - this.sessionStartTime;
      sessionStorage.setItem('sessionDuration', sessionDuration.toString()); 
      this.sessionId = null;
      this.sessionStartTime = null;
      sessionStorage.removeItem('sessionId'); 
      sessionStorage.removeItem('sessionStartTime');
    }
  }

 
  logout() {
    this._userId = null;
    this._userRole = null;
    this.endSession();
  }
}
