import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  gender?: string | null;
  phoneNumber?: string | null;
}

// interface LoginResponse {
//   token: string;
// }

interface AuthResponse {
  message: string;
  user?: any;
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/auth`; // backend url

  storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  signup(user: SignupData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, user);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      email,
      password,
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // !! converts to boolean
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
