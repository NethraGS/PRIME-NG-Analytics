import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {
   
    window.addEventListener('storage', this.onStorageChange.bind(this));
  }

 
  private onStorageChange(event: StorageEvent): void {
    if (event.key === 'authToken' && !event.newValue) {
     
      this.userService.logout();
      this.router.navigate(['/']); 
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
   
    if (this.userService.isAuthenticated) {
      return true; 
    } else {
      
      this.router.navigate(['/']);
      return false;
    }
  }
}
