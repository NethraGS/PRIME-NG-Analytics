import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CalendarOptions } from '@fullcalendar/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SidebarModule } from 'primeng/sidebar';
import { DialogModule } from 'primeng/dialog'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

interface RecurringSchedule {
  id: number;
  startDate: Date;
  endDate: Date;
  frequency: string;
}

@Component({
  selector: 'app-dimming-schedules',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    HttpClientModule,
    SidebarModule,
    DialogModule,
    FullCalendarModule
  ],
  templateUrl: './dimming-schedules.component.html',
  styleUrls: ['./dimming-schedules.component.scss']
})
export class DimmingSchedulesComponent implements OnInit {


  
  schedules: RecurringSchedule[] = [];
  newSchedule: RecurringSchedule = { id: 0, startDate: new Date(), endDate: new Date(), frequency: '' };
  selectedProfile: number | null = null;
  sidebarVisible: boolean = false;
  isEditing: boolean = false; 
  editingSchedule: RecurringSchedule | null = null;
  calendarVisible: boolean = false; 
  calendarOptions: any; 

  profileOptions = [
    { label: 'Profile 1', value: 1 },
    { label: 'Profile 2', value: 2 },
    { label: 'Profile 3', value: 3 },
  ];

  frequencyOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Custom', value: 'custom' }
  ];

  private apiUrl = 'http://localhost:8080/api/schedules'; 

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadExistingSchedules();
    //this.viewCalendar();
  }

  loadExistingSchedules() {
    this.http.get<RecurringSchedule[]>(this.apiUrl).subscribe(data => {
      this.schedules = data;
    }, error => {
      console.error('Error loading schedules:', error);
    });
  }

  toggleSidebar(editingSchedule?: RecurringSchedule) {
    if (editingSchedule) {
      this.isEditing = true;
      this.editingSchedule = { ...editingSchedule };
      this.newSchedule = { ...editingSchedule };
    } else {
      this.isEditing = false;
      this.newSchedule = { id: 0, startDate: new Date(), endDate: new Date(), frequency: '' };
    }
    this.sidebarVisible = !this.sidebarVisible;
  }

  addOrEditSchedule() {
    if (this.isEditing && this.editingSchedule) {
      this.updateSchedule();
    } else {
      this.addSchedule();
    }
  }

  addSchedule() {
    this.http.post<RecurringSchedule>(this.apiUrl, this.newSchedule).subscribe({
      next: (schedule) => {
        this.schedules.push(schedule);
        this.toggleSidebar();
      },
      error: (error) => {
        console.error('Error adding schedule:', error);
      }
    });
  }

  updateSchedule() {
    if (this.editingSchedule) {
      this.http.put<RecurringSchedule>(`${this.apiUrl}/${this.editingSchedule.id}`, this.newSchedule).subscribe({
        next: (updatedSchedule) => {
          const index = this.schedules.findIndex(s => s.id === updatedSchedule.id);
          if (index !== -1) {
            this.schedules[index] = updatedSchedule;
          }
          this.toggleSidebar();
        },
        error: (error) => {
          console.error('Error updating schedule:', error);
        }
      });
    }
  }

  removeSchedule(schedule: RecurringSchedule) {
    this.http.delete(`${this.apiUrl}/${schedule.id}`).subscribe({
      next: () => {
        this.schedules = this.schedules.filter(s => s.id !== schedule.id);
      },
      error: (error) => {
        console.error('Error removing schedule:', error);
      }
    });
  }

  saveSchedules() {
    this.http.post<RecurringSchedule[]>(this.apiUrl, this.schedules).subscribe({
      next: () => {
        this.loadExistingSchedules();
      },
      error: (error) => {
        console.error('Error saving schedules:', error);
      }
    });
  }

 
  viewCalendar() {
    this.calendarVisible = true;

    const events = this.schedules.map(schedule => ({
      title: schedule.frequency,
      start: schedule.startDate,
      end: schedule.endDate
    }));

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      events: events,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      plugins: [dayGridPlugin, timeGridPlugin]
    };
  }
}