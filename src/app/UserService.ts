// user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _userRole: string | null = null;

  set userRole(role: string) {
    this._userRole = role;
  }

  get userRole(): string | null {
    return this._userRole;
  }
}
