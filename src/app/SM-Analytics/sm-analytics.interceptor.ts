// tracking.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable()
export class TrackingInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if the request is for the login API (adjust the URL based on your backend API)
    if (req.url.includes('/api/login')) {  // Replace with your actual login API URL
      return next.handle(req).pipe(
        tap((event) => {
          // Check if the response is a successful login (based on the response body)
          if (event instanceof HttpResponse && event.body && event.body.message === 'Login successful') {
            // Ensure tracking.js is available and call startSession() to track the user session
            if (window.tracking && typeof window.tracking.startSession === 'function') {
              window.tracking.startSession(event.body.userId, event.body.role);  // Start the session
            }
          }
        })
      );
    }

    // For all other HTTP requests, just pass them through
    return next.handle(req);
  }
}
