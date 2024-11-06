import { Component, OnInit, OnDestroy } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LayoutService } from '../layout/service/app.layout.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  standalone: true,
  imports: [TabViewModule, ChartModule, CommonModule],
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  
  pageVisitsData: any;
  timeOnPageData: any;
  sessionDurationData: any;
  demographicData: any;
  peakUsageData: any;
  heatmapData: any;
  successRateData: any;
  failureRateData: any;

  // Options for the charts
  pageVisitsOptions: any;
  timeOnPageOptions: any;
  sessionDurationOptions: any;
  demographicOptions: any;
  peakUsageOptions: any;
  heatmapOptions: any;
  successRateOptions: any;
  failureRateOptions: any;

  dimmingProfilesData: any;
dimmingProfilesOptions: any;
dimmingSchedulesData: any;
dimmingSchedulesOptions: any;
pathAnalysisData: any;
pathAnalysisOptions: any;
dropOffPointsData: any;
dropOffPointsOptions: any;



  private subscription: Subscription;

  constructor(private layoutService: LayoutService) {
  
    this.subscription = this.layoutService.configUpdate$
      .pipe(debounceTime(25))
      .subscribe(() => this.initCharts());
  }

  ngOnInit() {
   
    this.initCharts();
  }

  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color').trim();
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary').trim();


    this.pageVisitsData = {
      labels: ['Map View', 'Scheduler', 'Dashboard', 'Settings'],
      datasets: [{
        label: 'Page Visits',
        backgroundColor: documentStyle.getPropertyValue('--primary-500').trim(),
        data: [300, 450, 200, 150],
      }],
    };

    this.pageVisitsOptions = this.getChartOptions(textColor, textColorSecondary);


    this.timeOnPageData = {
      labels: ['Map View', 'Scheduler', 'Dashboard', 'Settings'],
      datasets: [{
        label: 'Time (in mins)',
        data: [5, 8, 4, 2],
        fill: false,
        backgroundColor: documentStyle.getPropertyValue('--primary-500').trim(),
        borderColor: documentStyle.getPropertyValue('--primary-500').trim(),
      }],
    };

    this.timeOnPageOptions = this.getChartOptions(textColor, textColorSecondary);

    // Session Duration Data
    this.sessionDurationData = {
      labels: ['< 1 min', '1-5 mins', '5-10 mins', '> 10 mins'],
      datasets: [{
        data: [40, 35, 15, 10],
        backgroundColor: [
          documentStyle.getPropertyValue('--teal-500').trim(),
          documentStyle.getPropertyValue('--indigo-500').trim(),
          documentStyle.getPropertyValue('--purple-500').trim(),
          documentStyle.getPropertyValue('--orange-500').trim(),
        ],
      }],
    };

    this.sessionDurationOptions = this.getChartOptions(textColor);

    // Demographic Data
    this.demographicData = {
      labels: ['Mobile', 'Desktop', 'Tablet'],
      datasets: [{
        data: [60, 30, 10],
        backgroundColor: [
          documentStyle.getPropertyValue('--indigo-500').trim(),
          documentStyle.getPropertyValue('--purple-500').trim(),
          documentStyle.getPropertyValue('--teal-500').trim(),
        ],
      }],
    };

    this.demographicOptions = this.getChartOptions(textColor);

    // Peak Usage Data
    this.peakUsageData = {
      labels: ['Morning', 'Afternoon', 'Evening'],
      datasets: [{
        label: 'User Activity',
        data: [100, 300, 500],
        backgroundColor: documentStyle.getPropertyValue('--primary-500').trim(),
      }],
    };

    this.peakUsageOptions = this.getChartOptions(textColor, textColorSecondary);

    // Heatmap Data
    this.heatmapData = {
      labels: ['Section A', 'Section B', 'Section C', 'Section D'],
      datasets: [{
        label: 'User Engagement',
        data: [10, 50, 80, 30],
        backgroundColor: [
          documentStyle.getPropertyValue('--teal-500').trim(),
          documentStyle.getPropertyValue('--indigo-500').trim(),
          documentStyle.getPropertyValue('--purple-500').trim(),
          documentStyle.getPropertyValue('--orange-500').trim(),
        ],
      }],
    };

    this.heatmapOptions = this.getChartOptions(textColor);

    // Success Rate Data
    this.successRateData = {
      labels: ['Task 1', 'Task 2', 'Task 3'],
      datasets: [{
        label: 'Success Rate',
        data: [90, 70, 85],
        fill: false,
        borderColor: documentStyle.getPropertyValue('--primary-500').trim(),
      }],
    };

    this.successRateOptions = this.getChartOptions(textColor, textColorSecondary);

    // Failure Rate Data
    this.failureRateData = {
      labels: ['Task 1', 'Task 2', 'Task 3'],
      datasets: [{
        label: 'Failure Rate',
        data: [10, 30, 15],
        backgroundColor: documentStyle.getPropertyValue('--red-500').trim(),
      }],
    };

    this.failureRateOptions = this.getChartOptions(textColor, textColorSecondary);
  }

  // Helper function to get chart options
  private getChartOptions(textColor: string, textColorSecondary?: string) {
    return {
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: {
          ticks: { color: textColorSecondary || textColor },
          grid: { display: false },
        },
        y: {
          ticks: { color: textColorSecondary || textColor },
        },
      },
    };
  }

  ngOnDestroy() {
 
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
