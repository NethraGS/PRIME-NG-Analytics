import { NgModule } from '@angular/core';
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
import { HttpClientModule } from '@angular/common/http';
import { DynamicDialogModule } from 'primeng/dynamicdialog'; 
import { StreetlightDialogComponent } from './streetlight-dialog/streetlight-dialog.component'; // Adjust the path as necessary
import { DialogModule } from 'primeng/dialog'; 
import { FullCalendarModule } from '@fullcalendar/angular';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ChartsDemoComponent } from './demo/components/uikit/charts/chartsdemo.component';
import { MenubarModule } from 'primeng/menubar';
import { ChartModule } from 'primeng/chart';


@NgModule({
    declarations: [
        AppComponent,
        NotfoundComponent,
        StreetlightDialogComponent,ChartsDemoComponent
    ],
    imports: [
        AppRoutingModule,ContextMenuModule,MenubarModule,
        DialogModule,
        ChartModule,
        HttpClientModule,
        DynamicDialogModule,
        FullCalendarModule,ContextMenuModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService,
        CustomerService,
        EventService,
        IconService,
        NodeService,
        PhotoService,
        ProductService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
