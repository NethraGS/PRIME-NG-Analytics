import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private apiUrl = 'http://localhost:8080/api/analytics/sessions';  // Replace with your backend API

  constructor(private http: HttpClient) {}

  // Get total sessions
  getTotalSessions(startDate: string, endDate: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total?startDate=${startDate}&endDate=${endDate}`);
  }

  // Get average session duration
  getAverageSessionDuration(startDate: string, endDate: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/average-duration?startDate=${startDate}&endDate=${endDate}`);
  }

  // Get average sessions per user
  getAverageSessionsPerUser(startDate: string, endDate: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/average-sessions-per-user?startDate=${startDate}&endDate=${endDate}`);
  }

  getEventOverview(): Observable<any[]> {
    const url = 'http://localhost:8080/api/event-overview';
    return this.http.get<any[]>(url);
  }

  // New method to fetch top events
  getTopEvents(): Observable<any[]> {
    const url = 'http://localhost:8080/api/top-events';
    return this.http.get<any[]>(url);
  }
}
