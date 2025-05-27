import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 isLoggedIn(): boolean {
    return !!sessionStorage.getItem('userdata');
  }

  getUserRole(): string | null {
    const user = JSON.parse(sessionStorage.getItem('userdata') || 'null');
    return user?.role || null;
  }
}

