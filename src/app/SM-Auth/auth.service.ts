import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _userRole: string | null = null;
  private _userId: string | null = null;
  sessionId: string | null = null;
  sessionStartTime: number | null = null;

  constructor(private cookieService: CookieService, private http: HttpClient, ) {}

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
      this.cookieService.set('sessionId', this.sessionId); 
      this.cookieService.set('sessionStartTime', this.sessionStartTime.toString()); 
    }
  }

  // End the session
  endSession() {
    if (this.sessionId && this.sessionStartTime) {
      const sessionDuration = Date.now() - this.sessionStartTime;
      sessionStorage.setItem('sessionDuration', sessionDuration.toString());  
      this.cookieService.set('sessionDuration', sessionDuration.toString());  
      this.sessionId = null;
      this.sessionStartTime = null;
      sessionStorage.removeItem('sessionId');  
      sessionStorage.removeItem('sessionStartTime');  
      this.cookieService.delete('sessionId');  
    }
  }
formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

logout() {
  sessionStorage.setItem('logout', 'true');


  const sessionData = {
    sessionId: sessionStorage.getItem('sessionId') || '',
    userId: Number(this._userId), 
    userRole: this._userRole || '',
    sessionStartTime: this.formatDate(new Date(parseInt(sessionStorage.getItem('sessionStartTime') || '0'))),
    sessionEndTime: this.formatDate(new Date())
  };

  this.http.post('http://192.168.56.192:8080/api/sessions/store', sessionData)
    .subscribe(
      response => {
        console.log('Session data saved successfully:', response);
      },
      error => {
        console.error('Error saving session data:', error);
      }
    );

  this._userId = null;
  this._userRole = null;
  this.endSession();
  this.cookieService.delete('authToken');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('sessionId');
  sessionStorage.removeItem('sessionStartTime');
}

  
}
