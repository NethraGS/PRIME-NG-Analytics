import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private journeyPath: { url: string, timestamp: string }[] = [];

  constructor(private router: Router) {
    this.loadTrackingScript(environment.trackingScript);
    this.trackJourneyPath();
  }

  private loadTrackingScript(scriptUrl: string) {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    document.body.appendChild(script);
    console.log('Tracking script loaded:', scriptUrl); 
  }


  private trackJourneyPath() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const pathData = {
          url: event.urlAfterRedirects,
          timestamp: new Date().toISOString(),
        };
        this.journeyPath.push(pathData); 
        console.log('Journey path updated:', this.journeyPath); 


        this.sendJourneyDataToBackend(pathData);
      }
    });
  }


  private sendJourneyDataToBackend(data: { url: string, timestamp: string }) {
    fetch('http://localhost:8080/api/track-journey', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to send journey data');
      }
      console.log('Journey data sent to backend:', data); 
    })
    .catch(error => console.error('Journey tracking error:', error));
  }
}
