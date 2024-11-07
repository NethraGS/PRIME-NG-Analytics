import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsDemoRoutingModule } from './chartsdemo-routing.module';
import { ChartModule } from 'primeng/chart'


@NgModule({
	imports: [
		CommonModule,
		ChartsDemoRoutingModule,
		ChartModule
	],
	
})
export class ChartsDemoModule { }
