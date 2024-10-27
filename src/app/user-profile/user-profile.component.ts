import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { UserService } from '../UserService';

interface User {
  username: string;
  email: string;
  phone: string;
  address: string;
  location: string;
  tenantId: string;
  tenantRegion: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CardModule, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null; // Initialize as null to handle loading state

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUserDetails();
  }

  fetchUserDetails(): void {
    const userId = this.userService.userId; // Get userId from the service
    if (userId) {
      this.http.get<User>(`http://localhost:8080/api/users/${userId}`).subscribe({
        next: (data) => this.user = data,
        error: (error) => console.error('Error fetching user data:', error)
      });
    }
  }
}
