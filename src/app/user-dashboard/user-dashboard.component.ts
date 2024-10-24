import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DimmingProfilesComponent } from '../dimming-profiles/dimming-profiles.component';
import { MapviewComponent } from '../map-view/map-view.component';
import { PanelModule } from 'primeng/panel'; // Panel as a widget container
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ChartModule } from 'primeng/chart';
import { MenuItem } from 'primeng/api';
import { ProductService } from '../demo/service/product.service';
import { Subscription, debounceTime } from 'rxjs';
import { Product } from '../demo/api/product';
import { DimmingSchedulesComponent } from '../dimming-schedules/dimming-schedules.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, DimmingProfilesComponent, MapviewComponent, DimmingSchedulesComponent, PanelModule, TableModule, ChartModule, MenuModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit, OnDestroy {

  maintenanceRecords: any[] = []; // Initialize as an empty array
  operationalData: any; // Adjust type according to your chart data structure
  items!: MenuItem[];
  products!: Product[];
  chartData: any;
  chartOptions: any;
  subscription!: Subscription;

  constructor(private productService: ProductService, public layoutService: LayoutService) {
      this.subscription = this.layoutService.configUpdate$
          .pipe(debounceTime(25))
          .subscribe((config) => {
              this.initChart();
          });
  }

  ngOnInit() {
      this.initChart();
      this.productService.getProductsSmall().then(data => this.products = data);
      this.fetchMaintenanceRecords(); // Fetch maintenance records
      this.items = [
          { label: 'Add New', icon: 'pi pi-fw pi-plus' },
          { label: 'Remove', icon: 'pi pi-fw pi-minus' }
      ];
  }

  initChart() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.chartData = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
              {
                  label: 'First Dataset',
                  data: [65, 59, 80, 81, 56, 55, 40],
                  fill: false,
                  backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                  borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                  tension: .4
              },
              {
                  label: 'Second Dataset',
                  data: [28, 48, 40, 19, 86, 27, 90],
                  fill: false,
                  backgroundColor: documentStyle.getPropertyValue('--green-600'),
                  borderColor: documentStyle.getPropertyValue('--green-600'),
                  tension: .4
              }
          ]
      };

      this.chartOptions = {
          plugins: {
              legend: {
                  labels: {
                      color: textColor
                  }
              }
          },
          scales: {
              x: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              },
              y: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              }
          }
      };
  }

  fetchMaintenanceRecords() {
      // Example: Fetch maintenance records from a service
      // You should replace this with your actual data fetching logic
      this.maintenanceRecords = [
          { streetlightId: 'SL001', date: new Date(), status: 'Completed' },
          { streetlightId: 'SL002', date: new Date(), status: 'Pending' },
          { streetlightId: 'SL003', date: new Date(), status: 'In Progress' },
      ];
  }

  ngOnDestroy() {
      if (this.subscription) {
          this.subscription.unsubscribe();
      }
  }
}
