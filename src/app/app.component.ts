import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './UserService';
import { TrackingService } from './tracking.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private userService: UserService,
    private router: Router,
    private trackingService: TrackingService,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    
    window.addEventListener('storage', this.onStorageChange.bind(this));
  }

  ngOnDestroy(): void {
   
    window.removeEventListener('storage', this.onStorageChange.bind(this));
  }


  onStorageChange(event: StorageEvent): void {
    if (event.key === 'authToken' && !event.newValue) {
      
      this.userService.logout();  
    }
  }
}
