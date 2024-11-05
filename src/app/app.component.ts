// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TrackingService } from './tracking.service';
import { PluginManagerService } from './plugin-manager.service';
import { BasePluginModule } from './base-plugin.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor( private trackingService: TrackingService,
    private primengConfig: PrimeNGConfig,
   
    private pluginManager: PluginManagerService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;

    // Load BasePluginModule as a plugin
    this.pluginManager.loadPlugin(new BasePluginModule());
  }

}
