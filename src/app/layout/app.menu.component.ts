import { Component, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: MenuItem[] = [];            // Menubar items
    breadcrumbItems: MenuItem[] = [];  // Breadcrumb items

    isSchedulerOpen: boolean = false;  
    isAssetsOpen: boolean = false;     
    contextMenuItems: MenuItem[] = [];

    sidebarVisible: boolean = false;
    newProfile: any = {};

    @ViewChild('contextMenu') contextMenu!: ContextMenu;

    constructor(public layoutService: LayoutService) { }

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

        // Initial breadcrumb
        this.breadcrumbItems = [
            { label: 'Home', routerLink: ['/dashboard'] }
        ];
    }

    // Handle right-click context menu
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
