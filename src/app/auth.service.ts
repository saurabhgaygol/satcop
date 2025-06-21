import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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



  constructor(private http: HttpClient) { }
  api = 'https://script.google.com/macros/s/AKfycbzYI8TauE28bNIqbJqJ5hY_o62GbaTnZd3EGotyvmVrs4p_JUYt6yo5M3zmppDgNvJJPg/exec';
  getdata(): Observable<any> {
    return this.http.get<any>(this.api);
  }


  updateUserPassword(payload: any): Observable<any> {
    const form = new FormData();
    form.append("action", "update");
    form.append("name", payload.name);
    form.append("userId", payload.userId);
    form.append("password", payload.password);
    form.append("role", payload.role);
    form.append("profileImages", payload.profileImages || "");
    return this.http.post(this.api, form, {
      responseType: 'text'

    });
  }


}

