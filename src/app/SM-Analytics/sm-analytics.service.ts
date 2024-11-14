import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private journeyPath: { url: string, timestamp: string }[] = [];

  constructor(private router: Router) {
    this.loadTrackingScript(environment.trackingScript);
    
  }

  private loadTrackingScript(scriptUrl: string) {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    document.body.appendChild(script);
    console.log('Tracking script loaded:', scriptUrl); 
  }


}

