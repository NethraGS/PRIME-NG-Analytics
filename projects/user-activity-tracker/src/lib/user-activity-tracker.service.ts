// src/lib/user-activity-tracker.service.ts
import { Injectable, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/UserService';

@Injectable({
  providedIn: 'root',
})
export class UserActivityTrackerService {
  private apiUrl = 'http://localhost:8080/api/sessions'; // Spring Boot API URL for sessions
  private activityApiUrl = 'http://localhost:8080/api/track'; // Spring Boot API URL for user activity
  private sessionId: string;
  private sessionStartTime: number;
  private pageStartTime!: number;
  private currentPage: string | null = null;
  private userPath: string[] = []; // Track user path

  constructor(private http: HttpClient, private userService: UserService) {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.trackSessionStart();
    this.trackPageNavigation('Home'); // Assume home page on load
  }

  private generateSessionId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  // Track Session Start
  private trackSessionStart() {
    const eventData = {
      sessionId: this.sessionId,
      startTime: new Date(),
      userPath: this.userPath,
      user: { id: this.userService.userId }, // Include user object
    };
    this.sendEvent(eventData);
  }

  // Track Page Visits and Time on Page
  trackPageNavigation(pageName: string) {
    if (this.currentPage) {
      // Send page exit event with time spent on previous page
      this.trackPageExit();
    }
    this.currentPage = pageName;
    this.pageStartTime = Date.now();
    this.userPath.push(pageName); // Add page to user path

    const eventData = {
      type: 'page_visit',
      sessionId: this.sessionId,
      page: pageName, // Include the page field
      user: { id: this.userService.userId }, // Include user object
      timestamp: new Date(),
    };
    this.sendEvent(eventData);
  }

  private trackPageExit() {
    const timeOnPage = Date.now() - this.pageStartTime;
    const eventData = {
      type: 'page_exit',
      sessionId: this.sessionId,
      page: this.currentPage,
      timeOnPage: timeOnPage, // Time spent on the previous page
      user: { id: this.userService.userId }, // Include user object
      timestamp: new Date(),
    };
    this.sendEvent(eventData);
  }

  // Track Click Events (User Actions)
  @HostListener('window:click', ['$event'])
  trackClick(event: MouseEvent) {
    const eventData = {
      type: 'click',
      sessionId: this.sessionId,
      page: this.currentPage, // Include the current page
      target: (event.target as HTMLElement).tagName,
      user: { id: this.userService.userId }, // Include user object
      timestamp: new Date(),
    };
    this.sendEvent(eventData);
  }

  // Track Keyboard Events (User Actions)
  @HostListener('window:keydown', ['$event'])
  trackKeyDown(event: KeyboardEvent) {
    const eventData = {
      type: 'key_press',
      sessionId: this.sessionId,
      page: this.currentPage, // Include the current page
      key: event.key,
      user: { id: this.userService.userId }, // Include user object
      timestamp: new Date(),
    };
    this.sendEvent(eventData);
  }

  // Track Specific Actions
  trackCustomAction(action: string, details: any = {}) {
    const eventData = {
      type: 'custom_action',
      action,
      sessionId: this.sessionId,
      page: this.currentPage, // Include the current page
      user: { id: this.userService.userId }, // Include user object
      timestamp: new Date(),
      details,
    };
    this.sendEvent(eventData);
  }

  // Track Success and Failure Status
  trackTaskStatus(action: string, status: 'success' | 'failure') {
    const eventData = {
      type: 'task_status',
      action,
      status,
      sessionId: this.sessionId,
      page: this.currentPage, // Include the current page
      user: { id: this.userService.userId }, // Include user object
      timestamp: new Date(),
    };
    this.sendEvent(eventData);
  }

  // Track Session End
  @HostListener('window:beforeunload')
  trackSessionEnd() {
    const sessionDuration = Date.now() - this.sessionStartTime;
    this.trackPageExit(); // Capture time on last page

    const eventData = {
      type: 'session_end',
      sessionId: this.sessionId,
      duration: sessionDuration,
      userPath: this.userPath,
      page: this.currentPage, // Include the current page
      user: { id: this.userService.userId }, // Include user object
      timestamp: new Date(),
    };
    this.sendEvent(eventData);
  }

  // Send event data to the backend
  private sendEvent(data: any) {
    this.http.post(this.activityApiUrl, data).subscribe({
      next: response => console.log('Event sent:', response),
      error: err => console.error('Error sending event:', err),
    });
  }
}
