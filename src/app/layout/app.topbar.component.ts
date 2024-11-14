import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';
import { UserService } from '../SM-Auth/auth.service';
import { CookieService } from 'ngx-cookie-service';

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
    private cookieService: CookieService 

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


    this.userService.logout();  

    this.cookieService.delete('authToken'); 
    sessionStorage.removeItem('authToken'); 

   
    this.router.navigate(['/']);  
  }
}
