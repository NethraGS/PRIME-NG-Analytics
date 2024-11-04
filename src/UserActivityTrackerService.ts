import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fromEvent } from 'rxjs';

interface TrackConfig {
  trackEvents: {
    buttonClicks: boolean;
    formSubmissions: boolean;
    pageViews: boolean;
    customActions: boolean;
  };
  elements: {
    buttons: { id: string; eventType: string; description: string }[];
    forms: { id: string; eventType: string; description: string }[];
    customActions: { action: string; description: string }[];
  };
}

interface TrackingEvent {
  description: string;
  eventType: string;
  timestamp: string;
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
    this.http.get<TrackConfig>('/assets/tracking-config.json').subscribe((config) => {
      this.config = config;
      this.initializeTracking();
    });
  }

  private initializeTracking() {
    if (!this.config) return;

    if (this.config.trackEvents.buttonClicks) {
      this.config.elements.buttons.forEach((button) => {
        const element = document.getElementById(button.id);
        if (element) {
          fromEvent(element, button.eventType).subscribe(() => {
            this.trackEvent(button.description, button.eventType);
          });
        }
      });
    }

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
    };

    this.http.post(this.apiUrl, { ...trackingEvent, ...additionalData }).subscribe({
      next: () => console.log('Event sent to backend:', trackingEvent),
      error: (error) => console.error('Error sending event:', error),
    });
  }
}
