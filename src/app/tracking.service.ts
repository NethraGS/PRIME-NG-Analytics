import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  
  constructor() {
    this.loadTrackingScript(environment.trackingScript);
  }

  private loadTrackingScript(scriptUrl: string) {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    document.body.appendChild(script);
  }
}
