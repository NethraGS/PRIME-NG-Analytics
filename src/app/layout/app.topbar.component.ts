import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';
import { UserService } from '../UserService';
import { CookieService } from 'ngx-cookie-service'; // Import the CookieService

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
  items!: MenuItem[];
  isMenuOpen = false;

  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;

  userRole: string | null = null; 
  userId: string | null = null; 

  constructor(
    public layoutService: LayoutService, 
    private router: Router, 
    private userService: UserService,
    private cookieService: CookieService // Inject CookieService
  ) {
    this.userRole = this.userService.userRole;
    this.userId = this.userService.userId;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; 
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const menuButton = document.querySelector('.layout-topbar-button');
    const dropdownMenu = document.querySelector('.p-dropdown-menu');

    // Close menu if clicked outside
    if (menuButton && dropdownMenu && !menuButton.contains(clickedElement) && !dropdownMenu.contains(clickedElement)) {
      this.isMenuOpen = false;
    }
  }

  logout() {
    // Use UserService to clear the session and user data
    this.userService.logout(); 

    // After logging out, navigate to the login page (or any other route)
    this.router.navigate(['/login']);  // You can change this route based on your application setup
    
    // Optionally, you can clear any menu state or reset other UI elements here
    this.isMenuOpen = false;  // Ensure the menu is closed after logout
  }
}
