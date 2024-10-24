import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { DimmingProfilesComponent } from '../dimming-profiles/dimming-profiles.component';
import { DimmingSchedulesComponent } from '../dimming-schedules/dimming-schedules.component';

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [TabViewModule,DimmingProfilesComponent,DimmingSchedulesComponent],
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.scss'
})
export class SchedulerComponent {

}
