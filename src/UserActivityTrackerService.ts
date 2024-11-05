import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators'; // Import filter for event type checking

interface TrackConfig {
  trackEvents: {
    buttonClicks: boolean;
    formSubmissions: boolean;
    pageViews: boolean;
    customActions: boolean;
  };
  elements: {
    forms: { id: string; eventType: string; description: string }[];
    customActions: { action: string; description: string }[];
  };
}

interface TrackingEvent {
  description: string;
  eventType: string;
  timestamp: string;
  targetId?: string; // To identify which button was clicked
}

@Injectable({
  providedIn: 'root',
})
export class UserActivityTrackerService {
  private config: TrackConfig | null = null;
  private renderer: Renderer2;
  private apiUrl = 'http://localhost:8080/api/track-event';

  constructor(private http: HttpClient, private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.loadConfig();
  }

  private loadConfig() {
    this.http.get<TrackConfig>('/assets/tracking-config.json').subscribe(
      (config) => {
        this.config = config;
        this.initializeTracking();
      },
      (error) => console.error('Failed to load tracking configuration:', error)
    );
  }

  private initializeTracking() {
    if (!this.config) return;

    // Track all button clicks
    if (this.config.trackEvents.buttonClicks) {
      const buttonContainer = document.body; // You could change this to a more specific container if necessary
      fromEvent<MouseEvent>(buttonContainer, 'click') // Specify the type as MouseEvent
        .pipe(
          filter((event) => (event.target as HTMLElement).tagName === 'BUTTON') // Filter for button clicks
        )
        .subscribe((event) => {
          const target = event.target as HTMLElement;
          this.trackEvent(`Button clicked: ${target.innerText}`, 'click', { targetId: target.id });
        });
    }

    // Track form submissions
    if (this.config.trackEvents.formSubmissions) {
      this.config.elements.forms.forEach((form) => {
        const element = document.getElementById(form.id);
        if (element) {
          fromEvent(element, form.eventType).subscribe(() => {
            this.trackEvent(form.description, form.eventType);
          });
        }
      });
    }
  }

  trackCustomAction(description: string, data: any) {
    if (this.config?.trackEvents.customActions) {
      this.trackEvent(description, 'custom', data);
    }
  }

  private trackEvent(description: string, eventType: string, additionalData?: any) {
    const trackingEvent: TrackingEvent = {
      description,
      eventType,
      timestamp: new Date().toISOString(),
      ...additionalData, // Spread additional data like targetId
    };

    this.http.post(this.apiUrl, trackingEvent).subscribe({
      next: () => console.log('Event sent to backend:', trackingEvent),
      error: (error) => console.error('Error sending event:', error),
    });
  }
}
