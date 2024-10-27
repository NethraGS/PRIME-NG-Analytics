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

  pageVisitsOptions: any;
  timeOnPageOptions: any;
  sessionDurationOptions: any;
  demographicOptions: any;
  peakUsageOptions: any;
  heatmapOptions: any;
  successRateOptions: any;
  failureRateOptions: any;

  subscription: Subscription;

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
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    // Page Visits Data
    this.pageVisitsData = {
      labels: ['Map View', 'Scheduler', 'Dashboard', 'Settings'],
      datasets: [
        {
          label: 'Page Visits',
          backgroundColor: documentStyle.getPropertyValue('--primary-500'),
          data: [300, 450, 200, 150],
        },
      ],
    };

    this.pageVisitsOptions = {
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { display: false },
        },
        y: {
          ticks: { color: textColorSecondary },
        },
      },
    };

    // Time on Page Data
    this.timeOnPageData = {
      labels: ['Map View', 'Scheduler', 'Dashboard', 'Settings'],
      datasets: [
        {
          label: 'Time (in mins)',
          data: [5, 8, 4, 2],
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--primary-500'),
          borderColor: documentStyle.getPropertyValue('--primary-500'),
        },
      ],
    };

    this.timeOnPageOptions = {
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { display: false },
        },
        y: {
          ticks: { color: textColorSecondary },
        },
      },
    };

    // Session Duration Data
    this.sessionDurationData = {
      labels: ['< 1 min', '1-5 mins', '5-10 mins', '> 10 mins'],
      datasets: [
        {
          data: [40, 35, 15, 10],
          backgroundColor: [
            documentStyle.getPropertyValue('--teal-500'),
            documentStyle.getPropertyValue('--indigo-500'),
            documentStyle.getPropertyValue('--purple-500'),
            documentStyle.getPropertyValue('--orange-500'),
          ],
        },
      ],
    };

    this.sessionDurationOptions = {
      plugins: { legend: { labels: { color: textColor } } },
    };

    // Demographic Data
    this.demographicData = {
      labels: ['Mobile', 'Desktop', 'Tablet'],
      datasets: [
        {
          data: [60, 30, 10],
          backgroundColor: [
            documentStyle.getPropertyValue('--indigo-500'),
            documentStyle.getPropertyValue('--purple-500'),
            documentStyle.getPropertyValue('--teal-500'),
          ],
        },
      ],
    };

    this.demographicOptions = {
      plugins: { legend: { labels: { color: textColor } } },
    };

    // Peak Usage Data
    this.peakUsageData = {
      labels: ['Morning', 'Afternoon', 'Evening'],
      datasets: [
        {
          label: 'User Activity',
          data: [100, 300, 500],
          backgroundColor: documentStyle.getPropertyValue('--primary-500'),
        },
      ],
    };

    this.peakUsageOptions = {
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { display: false },
        },
        y: {
          ticks: { color: textColorSecondary },
        },
      },
    };

    // Heatmap Data
    this.heatmapData = {
      labels: ['Section A', 'Section B', 'Section C', 'Section D'],
      datasets: [
        {
          label: 'User Engagement',
          data: [10, 50, 80, 30],
          backgroundColor: [
            documentStyle.getPropertyValue('--teal-500'),
            documentStyle.getPropertyValue('--indigo-500'),
            documentStyle.getPropertyValue('--purple-500'),
            documentStyle.getPropertyValue('--orange-500'),
          ],
        },
      ],
    };

    this.heatmapOptions = {
      plugins: { legend: { labels: { color: textColor } } },
    };

    // Success Rate Data
    this.successRateData = {
      labels: ['Task 1', 'Task 2', 'Task 3'],
      datasets: [
        {
          label: 'Success Rate',
          data: [90, 70, 85],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--primary-500'),
        },
      ],
    };

    this.successRateOptions = {
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { display: false },
        },
        y: {
          ticks: { color: textColorSecondary },
        },
      },
    };

    // Failure Rate Data
    this.failureRateData = {
      labels: ['Task 1', 'Task 2', 'Task 3'],
      datasets: [
        {
          label: 'Failure Rate',
          data: [10, 30, 15],
          backgroundColor: documentStyle.getPropertyValue('--red-500'),
        },
      ],
    };

    this.failureRateOptions = {
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { display: false },
        },
        y: {
          ticks: { color: textColorSecondary },
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
