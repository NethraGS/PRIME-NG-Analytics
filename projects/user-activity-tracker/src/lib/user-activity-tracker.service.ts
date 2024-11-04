import { Injectable, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/UserService';

@Injectable({
  providedIn: 'root',
})

export class UserActivityTrackerService {
  private apiUrl = 'http://localhost:8080/api/sessions'; 
  private activityApiUrl = 'http://localhost:8080/api/track'; 
  private sessionId: string;
  private sessionStartTime: number;
  private pageStartTime!: number;
  private currentPage: string | null = null;
  private userPath: string[] = []; 

  constructor(private http: HttpClient, private userService: UserService) {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.trackPageNavigation('Home'); 
  }

  private generateSessionId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  // Track Session Start
  public trackSessionStart() {
    const eventData = {
      sessionId: this.sessionId,
      startTime: new Date(),
      userPath: this.userPath,
      user: { id: this.userService.userId }, 
    };

    console.log('Tracking session start:', eventData);
    
    // Send session creation request to the backend
    this.http.post(`${this.apiUrl}`, eventData).subscribe({
      next: response => console.log('Session created:', response),
      error: err => console.error('Error creating session:', err),
    });
  }

  // Track Page Visits and Time on Page
  trackPageNavigation(pageName: string) {
    if (this.currentPage) {
      // Send page exit event with time spent on the previous page
      this.trackPageExit();
    }
    this.currentPage = pageName;
    this.pageStartTime = Date.now();
    this.userPath.push(pageName); 

    const eventData = {
      type: 'page_visit',
      sessionId: this.sessionId,
      page: pageName,
      user: { id: this.userService.userId }, 
      timestamp: new Date(),
    };
    
    console.log('Tracking page navigation:', eventData);
    this.sendEvent(eventData);
  }

  private trackPageExit() {
    const timeOnPage = Date.now() - this.pageStartTime;
    const eventData = {
      type: 'page_exit',
      sessionId: this.sessionId,
      page: this.currentPage,
      timeOnPage: timeOnPage, 
      user: { id: this.userService.userId }, 
      timestamp: new Date(),
    };

    console.log('Tracking page exit:', eventData);
    this.sendEvent(eventData);
  }

  // Track Click Events (User Actions)
  public trackButtonClick(buttonLabel: string) {
    const eventData = {
      type: 'click',
      sessionId: this.sessionId,
      page: this.currentPage,
      target: 'PrimeNG Button',
      buttonLabel: buttonLabel, // Add button label for clarity
      user: { id: this.userService.userId }, 
      timestamp: new Date(),
    };

    console.log('PrimeNG Button clicked:', buttonLabel, 'Event data:', eventData);
    this.sendEvent(eventData);
  }

  // Track Keyboard Events (User Actions)
  @HostListener('window:keydown', ['$event'])
  trackKeyDown(event: KeyboardEvent) {
    const eventData = {
      type: 'key_press',
      sessionId: this.sessionId,
      page: this.currentPage,
      key: event.key,
      user: { id: this.userService.userId },
      timestamp: new Date(),
    };

    console.log('Key pressed:', event.key, 'Event data:', eventData);
    this.sendEvent(eventData);
  }

  // Track Custom Actions
  trackCustomAction(action: string, details: any = {}) {
    const eventData = {
      type: 'custom_action',
      action,
      sessionId: this.sessionId,
      page: this.currentPage,
      user: { id: this.userService.userId },
      timestamp: new Date(),
      details,
    };

    console.log('Custom action tracked:', action, 'Event data:', eventData);
    this.sendEvent(eventData);
  }

  // Track Success and Failure Status
  trackTaskStatus(action: string, status: 'success' | 'failure') {
    const eventData = {
      type: 'task_status',
      action,
      status,
      sessionId: this.sessionId,
      page: this.currentPage,
      user: { id: this.userService.userId },
      timestamp: new Date(),
    };

    console.log('Task status tracked:', action, 'Status:', status, 'Event data:', eventData);
    this.sendEvent(eventData);
  }

  // Track Session End
  @HostListener('window:beforeunload')
  trackSessionEnd() {
    const sessionDuration = Date.now() - this.sessionStartTime;
    this.trackPageExit(); // Capture time on the last page

    const eventData = {
      type: 'session_end',
      sessionId: this.sessionId,
      duration: sessionDuration,
      userPath: this.userPath,
      page: this.currentPage,
      user: { id: this.userService.userId },
      timestamp: new Date(),
    };
    
    console.log('Tracking session end:', eventData);
    this.sendEvent(eventData);
  }

  // Send event data to the backend
  private sendEvent(data: any) {
    this.http.post(this.activityApiUrl, data).subscribe({
      next: response => console.log('Event sent:', response),
      error: err => console.error('Error sending event:', err),
    });
  }

  endSession() {
    const sessionDuration = Date.now() - this.sessionStartTime;
    const eventData = {
      type: 'session_end',
      sessionId: this.sessionId,
      duration: sessionDuration,
      userPath: this.userPath,
      user: { id: this.userService.userId },
      timestamp: new Date(),
    };

    console.log('Ending session:', eventData);
    
    // Send session end event to backend
    this.http.post(`${this.apiUrl}/end`, eventData).subscribe({
      next: response => console.log('Session ended:', response),
      error: err => console.error('Error ending session:', err),
    });

    this.sessionId = ''; // Clear sessionId after ending session
  }
}

