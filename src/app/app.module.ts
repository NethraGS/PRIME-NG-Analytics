import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DynamicDialogModule } from 'primeng/dynamicdialog'; 

import { DialogModule } from 'primeng/dialog'; 
import { FullCalendarModule } from '@fullcalendar/angular';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ChartsDemoComponent } from './demo/components/uikit/charts/chartsdemo.component';
import { MenubarModule } from 'primeng/menubar';
import { ChartModule } from 'primeng/chart';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TrackingService } from './tracking.service';
import { TrackingInterceptor } from 'src/assets/tracking.interceptor';

import { Router, NavigationEnd } from '@angular/router';

/*function initializeTracking(userActivityTrackerService: UserActivityTrackerService, router: Router) {
  return () => {
    // Listen for global navigation events
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const pageName = event.urlAfterRedirects;
        userActivityTrackerService.trackPageNavigation(pageName);
      }
    });
  };
} */

@NgModule({
    declarations: [
        AppComponent,
        NotfoundComponent,
        ChartsDemoComponent
    ],
    imports: [
        AppRoutingModule,
        ContextMenuModule,
        MenubarModule,
        BrowserModule,
        BrowserAnimationsModule,
        DialogModule,
        ChartModule,
        HttpClientModule,
        DynamicDialogModule,
        BreadcrumbModule,
        FullCalendarModule,
        ContextMenuModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService,TrackingService,
        CustomerService,
        EventService,
        IconService,
        NodeService,
        PhotoService,
        ProductService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TrackingInterceptor, // Register the interceptor
          multi: true
        },
        /*{
            provide: APP_INITIALIZER,
            useFactory: initializeTracking,
            deps: [UserActivityTrackerService, Router],
            multi: true
        }*/
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
