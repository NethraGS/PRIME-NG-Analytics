import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
  
})
export class BreadcrumbComponent implements OnInit {

    breadcrumbItems: MenuItem[] = [];

    constructor(private router: Router) { }

    ngOnInit() {
        this.breadcrumbItems = [{ label: 'Home', routerLink: ['/dashboard'] }];

        
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.updateBreadcrumb(event.urlAfterRedirects);
        });
    }

    updateBreadcrumb(url: string) {
      this.breadcrumbItems = []; 
  
      if (url.includes('/dashboard')) {
          // Home > Dashboard
          this.breadcrumbItems.push({ label: 'Home', routerLink: ['/dashboard'] });
          
          this.breadcrumbItems.push({ label: 'Dashboard', routerLink: ['/dashboard'] });
      } else if (url.includes('/mapview')) {
          // Assets > MapView
          this.breadcrumbItems.push({ label: 'Assets', routerLink: ['/mapview'] });
          this.breadcrumbItems.push({ label: 'MapView', routerLink: ['/mapview'] });
      } else if (url.includes('/scheduler')) {
          // Assets > Scheduler
          this.breadcrumbItems.push({ label: 'Assets', routerLink: ['/scheduler'] });
          this.breadcrumbItems.push({ label: 'Scheduler', routerLink: ['/scheduler'] });
          
          if (url.includes('/dimming-profiles')) {
              // Scheduler > Dimming Profiles
              this.breadcrumbItems.push({ label: 'Dimming Profiles', routerLink: ['/scheduler/dimming-profiles'] });
          } else if (url.includes('/dimming-schedules')) {
              // Scheduler > Dimming Schedules
              this.breadcrumbItems.push({ label: 'Dimming Schedules', routerLink: ['/scheduler/dimming-schedules'] });
          }
      } else if (url.includes('/charts')) {
          // Others > Charts
          this.breadcrumbItems.push({ label: 'Others', routerLink: ['/charts'] });
          this.breadcrumbItems.push({ label: 'Charts', routerLink: ['/charts'] });
      }
  }
  
}
