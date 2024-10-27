// src/app/user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _userRole: string | null = null;
  private _userId: string | null = null;

  // Setter and getter for userRole
  set userRole(role: string | null) {
    this._userRole = role;
  }

  get userRole(): string | null {
    return this._userRole;
  }

  // Setter and getter for userId
  set userId(id: string | null) {
    this._userId = id;
  }

  get userId(): string | null {
    return this._userId;
  }
}
