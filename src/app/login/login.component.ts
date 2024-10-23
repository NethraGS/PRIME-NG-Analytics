import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // For HTTP requests
import { Router } from '@angular/router';  // For navigation
import { PasswordModule } from 'primeng/password';  // PrimeNG password component
import { FormsModule } from '@angular/forms';  // Forms module for two-way binding
import { CommonModule } from '@angular/common';  // CommonModule for Angular directives

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
  `]
})
export class LoginComponent {

  username!: string;  
  password!: string;  
  errorMessage: string = ''; 

  constructor(private http: HttpClient, private router: Router) { }

  onSignIn() {
    const loginData = {
      username: this.username,  // Use 'username' as per your backend
      password: this.password
    };

    // Sending login data to the backend API
    this.http.post('http://localhost:8080/api/login', loginData).subscribe(
      (response: any) => {
        console.log('Login successful:', response);

       
        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);  
        } else {
          this.router.navigate(['/dashboard']);  // User Dashboard
        }
      },
      error => {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid username or password';  
      }
    );
  }
}
