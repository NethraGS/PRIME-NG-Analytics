import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from './AnalyticsService';
import { TabViewModule } from 'primeng/tabview';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { SankeyController, Flow } from 'chartjs-chart-sankey';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import 'chartjs-adapter-date-fns';

// Register required chart.js modules
Chart.register(...registerables, SankeyController, Flow);

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  standalone: true,
  imports: [TabViewModule, ChartModule, CommonModule, CalendarModule, FormsModule,TableModule],
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  // Analytics Data
  totalSessions: number = 0;
  averageSessionDuration: number = 0;
  averageSessionsPerUser: number = 0;

  eventOverview: any[] = [];
  topEvents: any[] = [];
  pieChartData: any;

  // For Path Analysis (Sankey Chart)
  pathAnalysisData: any;
  pathAnalysisOptions: any;

  // For new charts (Page Views)
  pageViewsOverTimeData: any;
  topPagesByViewsData: any;
  pageViewsOverTimeOptions: any;
  topPagesByViewsOptions: any;

  barData: any;
  pieData: any;
  barOptions: any;
  pieOptions: any;

  // Dates selected by user
  startDate: Date = new Date('2024-11-01T00:00:00');  // Default start date with time
  endDate: Date = new Date('2024-11-12T23:59:59');    // Default end date with time
eventDetails: any;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    // Call the methods to fetch data on initial load
    this.fetchAnalyticsData();
    this.initPathAnalysisChart();
    this.fetchEventOverviewData();
    this.fetchTopEventsData();
    this.fetchPageViewsOverTimeData();
    this.fetchTopPagesByViewsData();
    
  }

  // Fetch the data based on selected start and end dates
  fetchAnalyticsData(): void {
    const formattedStartDate = this.formatDate(this.startDate);
    const formattedEndDate = this.formatDate(this.endDate);

    this.analyticsService.getTotalSessions(formattedStartDate, formattedEndDate).subscribe(
      (data) => {
        this.totalSessions = data;
      },
      (error) => {
        console.error('Error fetching total sessions:', error);
      }
    );

    this.analyticsService.getAverageSessionDuration(formattedStartDate, formattedEndDate).subscribe(
      (data) => {
        this.averageSessionDuration = data;
      },
      (error) => {
        console.error('Error fetching average session duration:', error);
      }
    );

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


  fetchEventOverviewData() {
    this.analyticsService.getEventOverview().subscribe((data) => {
      this.eventDetails = data.map((item: any) => ({
        eventName: item[0],
        eventCount: item[1],
        totalUsers: item[2],
        eventCountPerUser: item[1] / item[2],  // Calculate event count per user
      }));
    });
  }

  fetchTopEventsData() {
    this.analyticsService.getTopEvents().subscribe((data) => {
      const labels = data.map((item: any) => item[0]);
      const counts = data.map((item: any) => item[1]);

      this.barData = {
        labels: labels,
        datasets: [
          {
            label: 'Top 5 Events',
            backgroundColor: '#42A5F5',
            data: counts,
          },
        ],
      };

      this.barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { beginAtZero: true },
        },
      };
    });
  }

// Helper method to format dates in the required 'yyyy-MM-dd' format
formatDatePageView(date: Date): string {
  const pad = (num: number) => num < 10 ? `0${num}` : num;
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are 0-based
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`; // Return the date in 'yyyy-MM-dd' format
}

// Method to fetch Page Views Over Time
fetchPageViewsOverTimeData() {
  const formattedStartDate = this.formatDatePageView(this.startDate); // Format date to 'yyyy-MM-dd'
  const formattedEndDate = this.formatDatePageView(this.endDate); // Format date to 'yyyy-MM-dd'

  this.analyticsService.getPageViewsOverTime(formattedStartDate, formattedEndDate).subscribe((data) => {
    // Convert data from object format to array format
    if (!Array.isArray(data)) {
      data = Object.entries(data).map(([date, pageViews]) => ({ date, pageViews }));
    }

    // Extract labels and page views counts for the chart
    const timeLabels = data.map((item: any) => new Date(item.date).getTime());
    const pageViewsCounts = data.map((item: any) => item.pageViews);

    // Chart configuration
    this.pageViewsOverTimeData = {
      labels: timeLabels,
      datasets: [
        {
          label: 'Page Views Over Time',
          data: pageViewsCounts,
          borderColor: '#42A5F5',
          fill: false,
        },
      ],
    };

    this.pageViewsOverTimeOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'yyyy-MM-dd', // Compatible format for tooltips
            displayFormats: {
              day: 'yyyy-MM-dd', // Compatible format for day display
            },
          },
        },
        y: {
          beginAtZero: true,
        },
      },
    };
  });
}


// Method to fetch Top Pages by Views
fetchTopPagesByViewsData() {
  const formattedStartDate = this.formatDate(this.startDate);
  const formattedEndDate = this.formatDate(this.endDate);

  this.analyticsService.getTopPagesByViews(formattedStartDate, formattedEndDate).subscribe((data) => {
    // Check if data is an array of objects with path-view pairs
    if (Array.isArray(data) && typeof data[0] === 'object') {
      data = data.map((item: any) => {
        const [pageName, pageViews] = Object.entries(item)[0];
        return { pageName, pageViews };
      });
    }

    // Extract page names and view counts
    const pageNames = data.map((item: any) => item.pageName);
    const pageViewsCounts = data.map((item: any) => item.pageViews);

    this.topPagesByViewsData = {
      labels: pageNames,
      datasets: [
        {
          label: 'Top Pages by Views',
          data: pageViewsCounts,
          backgroundColor: '#FFA726',
        },
      ],
    };

    this.topPagesByViewsOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
        },
      },
    };
  });
}


  ngOnDestroy() {
    // Clean up if needed
  }
}  