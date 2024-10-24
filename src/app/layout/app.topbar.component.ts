import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Router } from '@angular/router';
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

    constructor(public layoutService: LayoutService,private router: Router) { }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen; // Toggle menu visibility
      }

      @HostListener('document:click', ['$event'])
      handleClickOutside(event: MouseEvent) {
        const clickedElement = event.target as HTMLElement;
        const menuButton = document.querySelector('.layout-topbar-button');
        const dropdownMenu = document.querySelector('.p-dropdown-menu');
    
        // Check if the click is outside the menu and the button
        if (menuButton && dropdownMenu && !menuButton.contains(clickedElement) && !dropdownMenu.contains(clickedElement)) {
          this.isMenuOpen = false;
        }
      }

    logout() {
    
        // Redirect to login page
        this.router.navigate(['/login']);
      }
}
