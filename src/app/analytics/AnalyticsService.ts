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
    const url = 'http://localhost:8080/api/event-statistics';
    return this.http.get<any[]>(url);
  }

  // New method to fetch top events
  getTopEvents(): Observable<any[]> {
    const url = 'http://localhost:8080/api/top-events';
    return this.http.get<any[]>(url);
  }

  // New method for Total Page Views
  getTotalPageViews(startDate: string, endDate: string): Observable<number> {
    return this.http.get<number>(`http://localhost:8080/api/analytics/total-page-views?startDate=${startDate}&endDate=${endDate}`);
  }

  // New method for Unique Page Views
  getUniquePageViews(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/analytics/unique-page-views?startDate=${startDate}&endDate=${endDate}`);
  }

  getPageViewTrends(startDate: string, endDate: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/page-view-trends?startDate=${startDate}&endDate=${endDate}`);
  }

  getPageViewsOverTime(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/analytics/page-view-trends?startDate=${startDate}&endDate=${endDate}`);
  }
  
  getTopPagesByViews(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/analytics/top-pages?startDate=${startDate}&endDate=${endDate}`);
  }
  

}
