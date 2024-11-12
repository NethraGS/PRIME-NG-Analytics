import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:8080/api/analytics';

  constructor(private http: HttpClient) {}

  getTotalSessions(startDate: string, endDate: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/sessions/total?startDate=${startDate}&endDate=${endDate}`);
  }

  getAverageSessionDuration(startDate: string, endDate: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/sessions/average-duration?startDate=${startDate}&endDate=${endDate}`);
  }

  getAverageSessionsPerUser(startDate: string, endDate: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/sessions/average-sessions-per-user?startDate=${startDate}&endDate=${endDate}`);
  }

  getEventOverview(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/event-statistics');
  }

  getTopEvents(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/top-events');
  }

  getPageViewsOverTime(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/page-view-trends?startDate=${startDate}&endDate=${endDate}`);
  }

  getTopPagesByViews(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-pages?startDate=${startDate}&endDate=${endDate}`);
  }

  getPathAnalysisData(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/path-analysis');
  }

  getPageViewStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pageview/stats`);
  }
}
