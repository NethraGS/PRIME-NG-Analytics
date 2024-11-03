// tracking.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as rrweb from 'rrweb';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrackingService implements OnDestroy {
  private apiEndpoint = 'http://localhost:8080/api/events'; // Endpoint for event storage
  private sessionId: string; // Unique session ID
  private sessionStartTime: Date; // Session start time
  private events: any[] = []; // Array to hold tracking events
  private routerSubscription!: Subscription; // Subscription for router events

  constructor(private http: HttpClient, private router: Router) {
    this.sessionId = this.generateSessionId(); // Generate a new session ID
    this.sessionStartTime = new Date(); // Record the current time as session start time
    this.startSessionTracking(); // Start tracking session events
    this.trackNavigation(); // Start tracking navigation events
  }

  // Generate a unique session ID
  private generateSessionId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  // Start recording rrweb events
  private startSessionTracking() {
    rrweb.record({
      emit: (event) => {
        this.events.push(event); // Push recorded events into the events array
      },
    });

    // Periodically send events to the backend every 10 seconds
    setInterval(() => {
      if (this.events.length > 0) {
        this.sendEventsToBackend();
        this.events = []; // Clear events after sending
      }
    }, 10000);
  }

  // Subscribe to router events to track page views
  private trackNavigation() {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.trackPageView(event.urlAfterRedirects); // Track page view
      }
    });
  }

  // Track a page view event
  private trackPageView(page: string) {
    this.events.push({
      type: 'custom', // Event type
      data: {
        type: 'page_view', // Specific event type
        page: page, // URL of the page viewed
        timestamp: new Date(), // Timestamp of the event
      },
    });
  }

  // Track a user action
  public trackUserAction(actionType: string, actionData: any) {
    this.events.push({
      type: 'custom',
      data: {
        type: actionType,
        data: actionData,
        timestamp: new Date(),
      },
    });
  }

  // Send recorded events to the backend
  private sendEventsToBackend() {
    const payload = {
      sessionId: this.sessionId,
      sessionStartTime: this.sessionStartTime,
      events: this.events, // Events captured during the session
    };

    // Send a POST request to the backend
    this.http.post(this.apiEndpoint, payload).subscribe({
      error: (err) => console.error('Error sending events:', err), // Log any errors
    });
  }

  // Cleanup on service destruction
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe(); // Unsubscribe from router events
    }
  }
}
