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
        this.breadcrumbItems = [{ label: 'Dashboard', routerLink: ['/dashboard'] }];
    
        if (url.includes('/mapview')) {
           
            this.breadcrumbItems.push({ label: 'MapView', routerLink: ['/mapview'] });
        } else if (url.includes('/assets')) {
            
            this.breadcrumbItems.push({ label: 'Asset Table', routerLink: ['/assets'] });
        } else if (url.includes('/scheduler')) {
           
            if (url.includes('/dimming-profiles')) {
                this.breadcrumbItems.push({ label: 'Scheduler', routerLink: ['/scheduler'] });
                this.breadcrumbItems.push({ label: 'Dimming Profiles', routerLink: ['/scheduler/dimming-profiles'] });
            } else if (url.includes('/dimming-schedules')) {
                this.breadcrumbItems.push({ label: 'Scheduler', routerLink: ['/scheduler'] });
                this.breadcrumbItems.push({ label: 'Dimming Schedules', routerLink: ['/scheduler/dimming-schedules'] });
            }
        } else if (url.includes('/charts')) {
         
            this.breadcrumbItems.push({ label: 'Charts', routerLink: ['/charts'] });
        }
    }
    
  
}
