// src/app/plugin-manager.service.ts
import { Injectable } from '@angular/core';
import { Plugin } from './plugin.interface';

@Injectable({ providedIn: 'root' })
export class PluginManagerService {
  private plugins: Plugin[] = [];

  loadPlugin(plugin: Plugin) {
    this.plugins.push(plugin);
    plugin.initialize();
  }

  getPlugins(): Plugin[] {
    return this.plugins;
  }
}
