import { Component, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: MenuItem[] = [];
    breadcrumbItems: MenuItem[] = [];
    isSchedulerOpen: boolean = false;
    isAssetsOpen: boolean = false;
    contextMenuItems: MenuItem[] = [];

    sidebarVisible: boolean = false;
    newProfile: any = {};

    @ViewChild('contextMenu') contextMenu!: ContextMenu;

    constructor(public layoutService: LayoutService, private router: Router) { }

    ngOnInit() {
        // Menubar items
        this.model = [
            {
                label: 'Home',
                icon: 'pi pi-fw pi-home',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/dashboard']
                    }
                ]
            },
            {
                label: 'Assets',
                icon: 'pi pi-fw pi-folder',
                items: [
                    {
                        label: 'MapView',
                        icon: 'pi pi-fw pi-map',
                        routerLink: ['/mapview']
                    },
                    {
                        label: 'Asset Table', 
                        icon: 'pi pi-fw pi-table',
                        routerLink: ['/assets']
                    },
                    {
                        label: 'Scheduler',
                        icon: 'pi pi-fw pi-calendar',
                        items: [
                            {
                                label: 'Dimming Profiles',
                                icon: 'pi pi-fw pi-sliders-h',
                                routerLink: ['/scheduler/dimming-profiles']
                            },
                            {
                                label: 'Dimming Schedules',
                                icon: 'pi pi-fw pi-clock',
                                routerLink: ['/scheduler/dimming-schedules']
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Others',
                icon: 'pi pi-fw pi-chart-bar',
                items: [
                    {
                        label: 'Charts',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/charts']
                    }
                ]
            }
        ];
    
        this.breadcrumbItems = [{ label: 'Home', routerLink: ['/dashboard'] }];
    
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.updateBreadcrumb(event.urlAfterRedirects);
        });
    }
    
  
    updateBreadcrumb(url: string) {
        this.breadcrumbItems = [{ label: 'Home', routerLink: ['/dashboard'] }];
    
        if (url.includes('/mapview')) {
            this.breadcrumbItems.push({ label: 'Assets', routerLink: ['/mapview'] });
            this.breadcrumbItems.push({ label: 'MapView', routerLink: ['/mapview'] });
        } else if (url.includes('/assets/asset-table')) {
            this.breadcrumbItems.push({ label: 'Assets', routerLink: ['/assets/asset-table'] });
            this.breadcrumbItems.push({ label: 'Asset Table', routerLink: ['/assets/asset-table'] });
        } else if (url.includes('/scheduler')) {
            this.breadcrumbItems.push({ label: 'Assets', routerLink: ['/scheduler'] });
            if (url.includes('/dimming-profiles')) {
                this.breadcrumbItems.push({ label: 'Scheduler', routerLink: ['/scheduler'] });
                this.breadcrumbItems.push({ label: 'Dimming Profiles', routerLink: ['/scheduler/dimming-profiles'] });
            } else if (url.includes('/dimming-schedules')) {
                this.breadcrumbItems.push({ label: 'Scheduler', routerLink: ['/scheduler'] });
                this.breadcrumbItems.push({ label: 'Dimming Schedules', routerLink: ['/scheduler/dimming-schedules'] });
            }
        } else if (url.includes('/charts')) {
            this.breadcrumbItems.push({ label: 'Others', routerLink: ['/charts'] });
            this.breadcrumbItems.push({ label: 'Charts', routerLink: ['/charts'] });
        }
    }
    


    onRightClick(event: MouseEvent, item: any) {
        event.preventDefault();

        if (item.label === 'Dimming Profiles') {
            this.contextMenuItems = [
                { label: 'Add New Profile', icon: 'pi pi-fw pi-plus', command: () => this.addNewProfile() }
            ];
        } else if (item.label === 'Dimming Schedules') {
            this.contextMenuItems = [
                { label: 'Add New Schedule', icon: 'pi pi-fw pi-plus', command: () => this.addNewSchedule() }
            ];
        }

        this.contextMenu.show(event);
    }

    addNewProfile() {
        this.newProfile = {};  
        this.sidebarVisible = true;  
    }

    addNewSchedule() {
        console.log('Add new dimming schedule');
    }

    resetProfile() {
        this.newProfile = {};
    }

    saveProfile() {
        console.log('Profile saved:', this.newProfile);
        this.sidebarVisible = false;  
    }
}
