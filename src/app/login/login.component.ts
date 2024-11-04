// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // For HTTP requests
import { Router } from '@angular/router'; // For navigation
import { PasswordModule } from 'primeng/password'; // PrimeNG password component
import { FormsModule } from '@angular/forms'; // Forms module for two-way binding
import { CommonModule } from '@angular/common'; // CommonModule for Angular directives
import { UserService } from '../UserService';
import { UserActivityTrackerService } from 'projects/user-activity-tracker/src/public-api';
import { AuthGuard } from '../auth-guard.guard';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [PasswordModule, FormsModule, CommonModule],
  styles: [`
    :host ::ng-deep .pi-eye,
    :host ::ng-deep .pi-eye-slash {
      transform: scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
    }
  `],
  providers:[UserActivityTrackerService,AuthGuard]
})
export class LoginComponent {
  username!: string;
  password!: string;
  errorMessage: string = '';

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private userService: UserService
  ) { }

  onSignIn() {
    const loginData = {
      username: this.username, // Use 'username' as per your backend
      password: this.password
    };

    // Sending login data to the backend API
    this.http.post('http://localhost:8080/api/login', loginData).subscribe(
      (response: any) => {
        console.log('Login successful:', response);

        // Set userId and userRole in the service
        this.userService.userId = response.userId; // Keep as string
        this.userService.userRole = response.role;

        // Navigate based on role
        if (response.role === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/dashboard']); // User Dashboard
        }
      },
      error => {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid username or password';
      }
    );
  }
}
