// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TrackingService } from './tracking.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor( private trackingService: TrackingService,
    private primengConfig: PrimeNGConfig,
   
 
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;

   
  }

}
