import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from './AnalyticsService';
import { TabViewModule } from 'primeng/tabview';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { SankeyController, Flow } from 'chartjs-chart-sankey';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

// Register required chart.js modules
Chart.register(...registerables, SankeyController, Flow);

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  standalone: true,
  imports: [TabViewModule, ChartModule, CommonModule,CalendarModule,FormsModule],
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  // Analytics Data
  totalSessions: number = 0;
  averageSessionDuration: number = 0;
  averageSessionsPerUser: number = 0;

  // For Path Analysis (Sankey Chart)
  pathAnalysisData: any;
  pathAnalysisOptions: any;

  // Dates selected by user
  startDate: Date = new Date('2024-11-01T00:00:00');  // Default start date with time
  endDate: Date = new Date('2024-11-10T23:59:59');    // Default end date with time

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    // Call the methods to fetch data on initial load
    this.fetchAnalyticsData();
    this.initPathAnalysisChart();
  }

  // Fetch the data based on selected start and end dates
  fetchAnalyticsData(): void {
    // Convert dates to the required format (yyyy-MM-dd'T'HH:mm:ss)
    const formattedStartDate = this.formatDate(this.startDate);
    const formattedEndDate = this.formatDate(this.endDate);

    // Fetch total sessions
    this.analyticsService.getTotalSessions(formattedStartDate, formattedEndDate).subscribe(
      (data) => {
        this.totalSessions = data;
      },
      (error) => {
        console.error('Error fetching total sessions:', error);
      }
    );

    // Fetch average session duration
    this.analyticsService.getAverageSessionDuration(formattedStartDate, formattedEndDate).subscribe(
      (data) => {
        this.averageSessionDuration = data;
      },
      (error) => {
        console.error('Error fetching average session duration:', error);
      }
    );

    // Fetch average sessions per user
    this.analyticsService.getAverageSessionsPerUser(formattedStartDate, formattedEndDate).subscribe(
      (data) => {
        this.averageSessionsPerUser = data;
      },
      (error) => {
        console.error('Error fetching average sessions per user:', error);
      }
    );
  }

  // Helper function to format the date to yyyy-MM-dd'T'HH:mm:ss
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  // Initialize Path Analysis Chart (Sankey)
  async initPathAnalysisChart() {
    try {
      const response = await fetch('http://localhost:8080/api/preferred-paths');
      const paths = await response.json();

      // Structure data for the Sankey chart
      const dataPoints = paths.map((path: any) => ({
        from: path.previousPage,
        to: path.currentPage,
        flow: path.pathCount,
      }));

      this.pathAnalysisData = {
        datasets: [
          {
            label: 'User Journey Flow',
            data: dataPoints,
            colorFrom: '#42A5F5',
            colorTo: '#FFA726',
            borderWidth: 0,
          },
        ],
      };

      this.pathAnalysisOptions = {
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
      };
    } catch (error) {
      console.error('Error fetching path analysis data:', error);
    }
  }

  ngOnDestroy() {
    // Clean up if needed
  }
}
