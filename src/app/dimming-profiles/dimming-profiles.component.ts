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
import { UserActivityTrackerService } from 'projects/user-activity-tracker/src/public-api';
// Define the DimmingProfile interface directly here
interface DimmingProfile {
  id?: number;
  profileName: string;
  profileType: string;
  startTimeLampLevel: string; // Example: "50%"
  motionOrPhotocellStart: string; // Motion or Photocell
  sunriseLampLevel: string; // Example: "30%"
  motionOrPhotocellSunrise: string; // Motion or Photocell
  sunsetLampLevel: string; // Example: "70%"
  motionOrPhotocellSunset: string; // Motion or Photocell
}

@Component({
  selector: 'app-dimming-profiles',
  standalone: true,
  imports: [
    CommonModule, SidebarModule, FormsModule, ColorPickerModule, DropdownModule, CheckboxModule,
    ButtonModule, TableModule, InputTextModule, PanelModule, InputNumberModule, CalendarModule
  ],
  providers: [UserActivityTrackerService],
  templateUrl: './dimming-profiles.component.html',
  styleUrls: ['./dimming-profiles.component.scss'],
})
export class DimmingProfilesComponent implements AfterViewInit, OnDestroy {

  color: string = '#ff0000'; // Default color
  selectedProfileType: string | undefined;
  profileTypes = [
    { label: '24 Hours Profile', value: '24-hours' },
    { label: 'Custom Profile', value: 'custom' },
  ];

  dimmingProfiles: DimmingProfile[] = []; // To hold fetched profiles
  newProfile: DimmingProfile = {
    profileName: '',
    profileType: '',
    startTimeLampLevel: '',
    motionOrPhotocellStart: 'Motion',
    sunriseLampLevel: '',
    motionOrPhotocellSunrise: 'Photocell',
    sunsetLampLevel: '',
    motionOrPhotocellSunset: 'Motion'
  }; // To hold new or selected profile data
  sidebarVisible: boolean = false;

  constructor(private http: HttpClient, private userActivityTracker: UserActivityTrackerService) {}

  ngAfterViewInit() {
    this.loadProfiles(); // Load existing profiles when the component is initialized
  }

  ngOnDestroy() {}

  loadProfiles() {
    this.http.get<DimmingProfile[]>('http://localhost:8080/api/profiles').subscribe(
      profiles => {
        this.dimmingProfiles = profiles;
      },
      error => {
        console.error('Error loading profiles', error);
      }
    );
  }

  showSidebar() {
    this.sidebarVisible = true; // This function will now show the sidebar
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
      motionOrPhotocellSunset: 'Motion'
    }; // Reset profile data
  }

  saveProfile() {
    if (this.newProfile.id) {
      // Update existing profile
      this.http.put(`http://localhost:8080/api/profiles/${this.newProfile.id}`, this.newProfile).subscribe(
        () => {
          this.loadProfiles(); // Reload profiles after saving
          this.resetProfile(); // Reset new profile form
          this.sidebarVisible = false; // Hide sidebar after saving
          this.userActivityTracker.trackCustomAction('Profile Updated', this.newProfile); // Track action
        },
        error => {
          console.error('Error saving profile', error);
        }
      );
    } else {
      // Create new profile
      this.http.post('http://localhost:8080/api/profiles', this.newProfile).subscribe(
        () => {
          this.loadProfiles(); // Reload profiles after saving
          this.resetProfile(); // Reset new profile form
          this.sidebarVisible = false; // Hide sidebar after saving
          this.userActivityTracker.trackCustomAction('Profile Created', this.newProfile); // Track action
        },
        error => {
          console.error('Error saving profile', error);
        }
      );
    }
  }

  // Load profile data into the form for editing
  editProfile(profile: DimmingProfile) {
    this.newProfile = { ...profile }; // Copy the selected profile into newProfile for editing
    this.sidebarVisible = true; // Show the sidebar when editing
  }

  // Delete profile
  deleteProfile(id: number) {
    this.http.delete(`http://localhost:8080/api/profiles/${id}`).subscribe(
      () => {
        this.loadProfiles(); 
        this.userActivityTracker.trackButtonClick('Profile Deleted');
      },
      error => {
        console.error('Error deleting profile', error);
      }
    );
  }
}
