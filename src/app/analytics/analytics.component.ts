import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AnalyticsService } from './analytics.service';
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
  

  
  startDate: Date = new Date('2024-11-04T00:00:00'); 
  endDate: Date = new Date('2024-11-13T23:59:59');    
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
    if (this.pieChartContainer) {
      this.renderPieChart();
    }
  }

  fetchPieChartData(): void {
    this.analyticsService.getTotalTimeSpent().subscribe(
      data => {
        this.processPieChartData(data);
      },
      error => {
        console.error('Error fetching data from backend:', error);
      }
    );
  }
  

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
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }


  async initPathAnalysisChart() {
    try {
      const response = await fetch('http://192.168.56.192:8080/api/preferred-paths');
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
        eventCountPerUser: item[3],  
      }));
    });
  }

  fetchTopEventsData() {
    this.analyticsService.getTopEvents().subscribe((data) => {
     
      this.urls = Array.from(new Set(data.map((item: any) => item[1])))
        .filter(url => url != null) 
        .map(url => ({ label: url || 'No URL', value: url || '' }));
  
  
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
  

  groupDataByAction(data: any[]) {
    const grouped = data.reduce((acc: any, item: any) => {
      const action = item[0]; 
      if (!acc[action]) {
        acc[action] = 0;
      }
      acc[action] += item[2];
      return acc;
    }, {});

    return Object.keys(grouped).map((action) => ({
      action,
      count: grouped[action],
    }));
  }

 
  onUrlFilterChange1() {
    this.fetchTopEventsData();
  }

formatDatePageView(date: Date): string {
  const pad = (num: number) => num < 10 ? `0${num}` : num;
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); 
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`; 
}


fetchPageViewsOverTimeData() {
  const formattedStartDate = this.formatDatePageView(this.startDate);
  const formattedEndDate = this.formatDatePageView(this.endDate);

  this.analyticsService.getPageViewsOverTime(formattedStartDate, formattedEndDate).subscribe((data) => {
    this.urls = Array.from(new Set(data.map((item: any) => this.formatUrlForDisplay(item.url))));

    const filteredData = this.selectedUrl ? data.filter((item: any) => this.formatUrlForDisplay(item.url) === this.selectedUrl) : data;

    const groupedData = this.groupDataByDate(filteredData, formattedStartDate, formattedEndDate);

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

formatUrlForDisplay(url: string): string {
  if (url === '/') return 'Login';
  return url.startsWith('#/') ? url.slice(2) : url;
}

  groupDataByDate(data: any[], startDate: string, endDate: string) {
    const allDates = this.getAllDatesInRange(startDate, endDate);
    const dataMap = data.reduce((acc: any, curr: any) => {
      const date = curr.date;
      acc[date] = (acc[date] || 0) + curr.pageViews; 
      return acc;
    }, {});

    return allDates.map((date) => ({
      date,
      pageViews: dataMap[date] || 0,
    }));
  }

  onUrlFilterChange() {
    this.fetchPageViewsOverTimeData(); 
  }

  
getAllDatesInRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateArray = [];
  while (start <= end) {
    dateArray.push(this.formatDatePageView(start)); 
    start.setDate(start.getDate() + 1); 
  }
  return dateArray;
}
fetchPageViewStats(): void {
  this.analyticsService.getPageViewStats().subscribe(
    (data) => {
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
    if (Array.isArray(data) && typeof data[0] === 'object') {
      data = data.map((item: any) => {
        const [pageName, pageViews] = Object.entries(item)[0];
        const formattedPageName = pageName === '/' ? 'Login' : pageName.replace(/^#\/|^\//, '');

        return { pageName: formattedPageName, pageViews };
      });
    }
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
            autoSkip: false, 
            font: {
              size: 10 
            }
          }
        },
      }
    };
  });
}
 
processPieChartData(data: any[]): void {
  const processedData = data.map(item => {
    const formattedUrl = item[0].replace('http://localhost:4200/#/', ''); 
    const minutes = (item[1] / 60).toFixed(2); 
    return { label: formattedUrl, value: parseFloat(minutes) };
  });
  const chartData = processedData.map(item => ({
    name: item.label,
    value: item.value,
  }));

  
  this.pieChartData = chartData;
  const rootStyle = window.getComputedStyle(document.documentElement);

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
  

  this.renderPieChart();
}

renderPieChart(): void {
  const chartDom = document.getElementById('pieChart')!;
  const myChart = echarts.init(chartDom);
  myChart.setOption(this.pieChartOptions);
}

  ngOnDestroy() {
  
  }
}  