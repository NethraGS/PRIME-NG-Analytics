import { Component, AfterViewInit, OnDestroy,HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SidebarModule } from 'primeng/sidebar';


interface DimmingProfile {
  id?: number;
  profileName: string;
  profileType: string;
  startTimeLampLevel: string;
  motionOrPhotocellStart: string;
  sunriseLampLevel: string;
  motionOrPhotocellSunrise: string;
  sunsetLampLevel: string;
  motionOrPhotocellSunset: string;
}

@Component({
  selector: 'app-dimming-profiles',
  standalone: true,
  templateUrl: './dimming-profiles.component.html',
  imports: [
    CommonModule, SidebarModule, FormsModule, ColorPickerModule, DropdownModule, CheckboxModule,
    ButtonModule, TableModule, InputTextModule, PanelModule, InputNumberModule, CalendarModule
  ],
  styleUrls: ['./dimming-profiles.component.scss'],

})
export class DimmingProfilesComponent implements AfterViewInit, OnDestroy {
  color: string = '#ff0000';
  selectedProfileType: string | undefined;
  profileTypes = [
    { label: '24 Hours Profile', value: '24-hours' },
    { label: 'Custom Profile', value: 'custom' },
  ];
  dimmingProfiles: DimmingProfile[] = [];
  newProfile: DimmingProfile = {
    profileName: '',
    profileType: '',
    startTimeLampLevel: '',
    motionOrPhotocellStart: 'Motion',
    sunriseLampLevel: '',
    motionOrPhotocellSunrise: 'Photocell',
    sunsetLampLevel: '',
    motionOrPhotocellSunset: 'Motion',
  };
  sidebarVisible: boolean = false;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.loadProfiles();
  }

  ngOnDestroy() {}

  loadProfiles() {
    this.http.get<DimmingProfile[]>('http://192.168.56.192:8080/api/profiles').subscribe(
      (profiles) => (this.dimmingProfiles = profiles),
      (error) => console.error('Error loading profiles', error)
    );
  }

  showSidebar() {
    this.sidebarVisible = true;
  }

  resetProfile() {
    this.newProfile = {
      profileName: '',
      profileType: '',
      startTimeLampLevel: '',
      motionOrPhotocellStart: 'Motion',
      sunriseLampLevel: '',
      motionOrPhotocellSunrise: 'Photocell',
      sunsetLampLevel: '',
      motionOrPhotocellSunset: 'Motion',
    };
  }

  saveProfile() {
    if (this.newProfile.id) {
      this.http.put(`http://192.168.56.192:8080/api/profiles/${this.newProfile.id}`, this.newProfile).subscribe(
        () => {
          this.loadProfiles();
          this.resetProfile();
          this.sidebarVisible = false;
          
        },
        (error) => console.error('Error saving profile', error)
      );
    } else {
      this.http.post('http://192.168.56.192:8080/api/profiles', this.newProfile).subscribe(
        () => {
          this.loadProfiles();
          this.resetProfile();
          this.sidebarVisible = false;
      
        },
        (error) => console.error('Error saving profile', error)
      );
    }
  }

  editProfile(profile: DimmingProfile) {
    this.newProfile = { ...profile };
    this.sidebarVisible = true;
  }

  deleteProfile(id: number) {
    this.http.delete(`http://192.168.56.192:8080/api/profiles/${id}`).subscribe(
      () => {
        this.loadProfiles();
       
      },
      (error) => console.error('Error deleting profile', error)
    );
  }
}
