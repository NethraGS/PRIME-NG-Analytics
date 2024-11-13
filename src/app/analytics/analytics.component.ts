import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
import { DropdownModule } from 'primeng/dropdown';
import * as echarts from 'echarts';



Chart.register(...registerables, SankeyController, Flow);

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  standalone: true,
  imports: [TabViewModule, ChartModule, CommonModule, CalendarModule, FormsModule,TableModule,DropdownModule],
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit, OnDestroy {

  @ViewChild('pieChartContainer') pieChartContainer: ElementRef | undefined;
 
  topNpageviews:number = 5;
  totalSessions: number = 0;
  averageSessionDuration: number = 0;
  averageSessionsPerUser: number = 0;

  eventOverview: any[] = [];
  pageViewStats: any[] = []; 
  topEvents: any[] = [];
  pieChartData: any;

  
  pathAnalysisData: any;
  pathAnalysisOptions: any;

  
  pageViewsOverTimeData: any;
  topPagesByViewsData: any;
  pageViewsOverTimeOptions: any;
  topPagesByViewsOptions: any;

  barData: any;
  pieData: any;
  barOptions: any;
  pieOptions: any;

  pieChartLabels: any;
  pieChartOptions: any;
  

  
  startDate: Date = new Date('2024-11-04T00:00:00');  // Default start date with time
  endDate: Date = new Date('2024-11-13T23:59:59');    // Default end date with time
eventDetails: any;
selectedUrl: any;
urls: any;
totalTimeSpent: any;
eventData: any[] = []; 

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
 
    this.fetchAnalyticsData();
    this.initPathAnalysisChart();
    this.fetchEventOverviewData();
    this.fetchTopEventsData();
    this.fetchPageViewsOverTimeData();
    this.fetchTopPagesByViewsData();
    this.fetchPageViewStats();
    this.fetchPieChartData();

  }
  ngAfterViewInit(): void {
    // Now, you can safely initialize the chart once the DOM is available
    if (this.pieChartContainer) {
      this.renderPieChart();
    }
  }

  fetchPieChartData(): void {
    this.analyticsService.getTotalTimeSpent().subscribe(
      data => {
        // Once the data is fetched, process it and update the chart
        this.processPieChartData(data);
      },
      error => {
        console.error('Error fetching data from backend:', error);
      }
    );
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
        this.averageSessionDuration = Math.trunc((data/6000) * 100) / 100;
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
      // Transform nested array data into an array of objects with specific keys
      this.eventDetails = data.map((item: any) => ({
        eventName: item[0],          // e.g., "click"
        eventCount: item[1],         // e.g., 695
        totalUsers: item[2],         // e.g., 3
        eventCountPerUser: item[3],  // e.g., 231.00
      }));
    });
  }

  fetchTopEventsData() {
    this.analyticsService.getTopEvents().subscribe((data) => {
      // Collect all unique URLs from the data and format for the dropdown
      this.urls = Array.from(new Set(data.map((item: any) => item[1])))
        .filter(url => url != null)  // Ensure no null values
        .map(url => ({ label: url || 'No URL', value: url || '' })); // Add label and value
  
      // Process data for the bar chart as before
      const filteredData = this.selectedUrl
        ? data.filter((item: any) => item[1] === this.selectedUrl)
        : data;
  
      const groupedData = this.groupDataByAction(filteredData);
  
      this.barData = {
        labels: groupedData.map((item: any) => item.action),
        datasets: [
          {
            label: 'Event Count',
            data: groupedData.map((item: any) => item.count),
            backgroundColor: '#42A5F5',
          },
        ],
      };
  
      this.barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Actions' } },
          y: { title: { display: true, text: 'Event Count' }, beginAtZero: true },
        },
      };
    });
  }
  

  // Helper function to group events by action type (e.g., "click", "scroll", etc.)
  groupDataByAction(data: any[]) {
    const grouped = data.reduce((acc: any, item: any) => {
      const action = item[0]; // Action type (click, scroll, etc.)
      if (!acc[action]) {
        acc[action] = 0;
      }
      acc[action] += item[2]; // Add the count (item[2]) to the corresponding action
      return acc;
    }, {});

    // Convert the grouped data to an array of objects
    return Object.keys(grouped).map((action) => ({
      action,
      count: grouped[action],
    }));
  }

  // Method to handle URL change in dropdown
  onUrlFilterChange1() {
    this.fetchTopEventsData();
  }


// Helper method to format dates in the required 'yyyy-MM-dd' format
formatDatePageView(date: Date): string {
  const pad = (num: number) => num < 10 ? `0${num}` : num;
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are 0-based
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`; // Return the date in 'yyyy-MM-dd' format
}


fetchPageViewsOverTimeData() {
  const formattedStartDate = this.formatDatePageView(this.startDate);
  const formattedEndDate = this.formatDatePageView(this.endDate);

  this.analyticsService.getPageViewsOverTime(formattedStartDate, formattedEndDate).subscribe((data) => {
    // Collect all unique URLs and format them for display in the dropdown
    this.urls = Array.from(new Set(data.map((item: any) => this.formatUrlForDisplay(item.url))));
    
    // Default to showing all data if no URL is selected
    const filteredData = this.selectedUrl ? data.filter((item: any) => this.formatUrlForDisplay(item.url) === this.selectedUrl) : data;

    // Convert and structure the data for charting
    const groupedData = this.groupDataByDate(filteredData, formattedStartDate, formattedEndDate);

    // Prepare chart data
    this.pageViewsOverTimeData = {
      labels: groupedData.map((item: any) => item.date),
      datasets: [
        {
          label: 'Page Views Over Time',
          data: groupedData.map((item: any) => item.pageViews),
          borderColor: '#42A5F5',
          fill: false,
          tension: 0.1,
        },
      ],
    };

    // Chart options
    this.pageViewsOverTimeOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'yyyy-MM-dd',
            displayFormats: {
              day: 'yyyy-MM-dd',
            },
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 20,
          },
        },
      },
    };
  });
}

// Helper function to format URLs for dropdown display
formatUrlForDisplay(url: string): string {
  if (url === '/') return 'Login';
  return url.startsWith('#/') ? url.slice(2) : url;
}


  // Group data by date and fill missing dates with zero page views
  groupDataByDate(data: any[], startDate: string, endDate: string) {
    const allDates = this.getAllDatesInRange(startDate, endDate);
    const dataMap = data.reduce((acc: any, curr: any) => {
      const date = curr.date;
      acc[date] = (acc[date] || 0) + curr.pageViews; // Sum page views for the same date
      return acc;
    }, {});

    return allDates.map((date) => ({
      date,
      pageViews: dataMap[date] || 0,
    }));
  }

  // Handle URL filter selection
  onUrlFilterChange() {
    this.fetchPageViewsOverTimeData(); // Fetch data again to apply filter
  }

    

// Helper function to generate all dates between start and end date
getAllDatesInRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateArray = [];
  while (start <= end) {
    dateArray.push(this.formatDatePageView(start)); // Push formatted date
    start.setDate(start.getDate() + 1); // Move to the next day
  }
  return dateArray;
}
fetchPageViewStats(): void {
  this.analyticsService.getPageViewStats().subscribe(
    (data) => {
      // Directly assign the data to pageViewStats as it is already in the correct format
      this.pageViewStats = data;
      console.log('Fetched page view stats:', this.pageViewStats);
    },
    (error) => {
      console.error('Error fetching page view stats:', error);
    }
  );
}





fetchTopPagesByViewsData() {
  const formattedStartDate = this.formatDate(this.startDate);
  const formattedEndDate = this.formatDate(this.endDate);

  this.analyticsService.getTopPagesByViews(formattedStartDate, formattedEndDate).subscribe((data) => {
    // Check if data is an array of objects with path-view pairs
    if (Array.isArray(data) && typeof data[0] === 'object') {
      data = data.map((item: any) => {
        const [pageName, pageViews] = Object.entries(item)[0];
        
        // Remove "#" and "/" prefix from page names and assign "Login" for root "/"
        const formattedPageName = pageName === '/' ? 'Login' : pageName.replace(/^#\/|^\//, '');

        return { pageName: formattedPageName, pageViews };
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
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          ticks: {
            autoSkip: false,  // Ensure all labels display
            font: {
              size: 10 // Optional: increase font size for readability
            }
          }
        },
      }
    };
  });
}

 
processPieChartData(data: any[]): void {
  // Process the data to convert seconds to minutes
  const processedData = data.map(item => {
    const formattedUrl = item[0].replace('http://localhost:4200/#/', ''); // Format URL
    const minutes = (item[1] / 60).toFixed(2); // Convert seconds to minutes
    return { label: formattedUrl, value: parseFloat(minutes) };
  });

  // Prepare the data for ECharts
  const chartData = processedData.map(item => ({
    name: item.label,
    value: item.value,
  }));

  // Initialize the chart options
  this.pieChartData = chartData;

  // You can set colors dynamically, here I'm using a fixed set of colors
  const rootStyle = window.getComputedStyle(document.documentElement);

  // ECharts option for pie chart
  this.pieChartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Time Spent',
        type: 'pie',
        radius: '50%',
        data: this.pieChartData,
        itemStyle: {
          normal: {
            color: function (params: any) {
              // You can map to CSS colors or use a dynamic color function
              const colors = [
                rootStyle.getPropertyValue('--indigo-500').trim(),
                rootStyle.getPropertyValue('--purple-500').trim(),
                rootStyle.getPropertyValue('--teal-500').trim(),
                rootStyle.getPropertyValue('--orange-500').trim(),
                rootStyle.getPropertyValue('--blue-500').trim(),
                rootStyle.getPropertyValue('--green-500').trim(),
                rootStyle.getPropertyValue('--red-500').trim(),
                rootStyle.getPropertyValue('--yellow-500').trim(),
                rootStyle.getPropertyValue('--pink-500').trim(),
                rootStyle.getPropertyValue('--cyan-500').trim(),
                
              ];
              return colors[params.dataIndex % colors.length];
            },
          },
        },
      },
    ],
  };
  
  // Render the chart after the options are set
  this.renderPieChart();
}

renderPieChart(): void {
  const chartDom = document.getElementById('pieChart')!;
  const myChart = echarts.init(chartDom);
  myChart.setOption(this.pieChartOptions);
}

  ngOnDestroy() {
    // Clean up if needed
  }
}  