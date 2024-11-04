import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _userRole: string | null = null;
  private _userId: string | null = null;
  sessionId: string | null = null;
  sessionStartTime: number | null = null;

  // Setter and getter for userRole
  set userRole(role: string | null) {
    this._userRole = role;
  }

  get userRole(): string | null {
    return this._userRole;
  }

  // Setter and getter for userId
  set userId(id: string | null) {
    this._userId = id;
  }

  get userId(): string | null {
    return this._userId;
  }

  // Check if the user is authenticated
  get isAuthenticated(): boolean {
    return !!this._userId; // Assuming _userId is set when the user is authenticated
  }

  // Generate a new session ID
  generateSessionId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  // Start a new session
  startSession() {
    if (!this.sessionId) {
      this.sessionId = this.generateSessionId();
      this.sessionStartTime = Date.now();
      // Additional logic to handle session start can be added here
    }
  }

  // End the current session
  endSession() {
    if (this.sessionId && this.sessionStartTime) {
      const sessionDuration = Date.now() - this.sessionStartTime;
      // Logic to handle session end can be added here
      this.sessionId = null;
      this.sessionStartTime = null;
    }
  }

  // Handle user logout
  logout() {
    this._userId = null;
    this._userRole = null;
    this.endSession(); // Call endSession to clean up session data
  }
}
