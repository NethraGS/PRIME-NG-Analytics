// src/app/base-plugin.module.ts
import { NgModule } from '@angular/core';
import { Plugin } from './plugin.interface';

@NgModule({
  // Provide any shared components or services here if needed
})
export class BasePluginModule implements Plugin {
  id = 'base-plugin';
  name = 'Base Plugin';
  version = '1.0.0';

  initialize() {
    console.log(`${this.name} (v${this.version}) initialized.`);
    // Add any initialization logic here
  }

  configure(config: any) {
    console.log(`${this.name} configured with`, config);
    // Configure the plugin with the given config
  }

  getComponents() {
    return []; // Return components if applicable
  }

  getServices() {
    return []; // Return services if applicable
  }
}
