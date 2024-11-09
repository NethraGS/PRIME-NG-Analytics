import { Component, OnInit, OnDestroy } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { SankeyController, Flow } from 'chartjs-chart-sankey';

// Register required chart.js modules
Chart.register(...registerables, SankeyController, Flow);

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  standalone: true,
  imports: [TabViewModule, ChartModule, CommonModule],
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  pathAnalysisData: any;
  pathAnalysisOptions: any;

  async ngOnInit() {
    await this.initPathAnalysisChart();
  }

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
      console.error("Error fetching path analysis data:", error);
    }
  }

  ngOnDestroy() {
    // Clean up if needed
  }
}
