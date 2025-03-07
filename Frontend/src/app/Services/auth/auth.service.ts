import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private userApiUrl = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  /**
   * Handles user login and stores authentication token.
   * @param email - User email
   * @param password - User password
   * @param rememberMe - Whether to store token in localStorage or sessionStorage
   * @returns Observable containing authentication response
   */
  login(email: string, password: string, rememberMe: boolean): Observable<AuthResponse> {
    const credentials = { email: email.trim(), password: password.trim() };

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          this.storeToken(response.token, rememberMe);
          this.storeUserRole(response.user.role);
        }
      })
    );
  }

  /**
   * Sends password reset link to user email.
   * @param email - User email
   * @returns Observable containing server response
   */
  sendResetLink(email: string): Observable<any> {
    return this.http.post(this.userApiUrl, { email: email.trim() });
  }

  /**
   * Checks if the user is authenticated based on stored token.
   * @returns Observable containing authentication status
   */
  checkAuthStatus(): Observable<{ valid: boolean; user: { role: string } }> {
    if (!isPlatformBrowser(this.platformId)) {
      return new Observable(observer => observer.error());
    }

    const token = this.getToken();
    if (!token) return new Observable(observer => observer.error());

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<{ valid: boolean; user: { role: string } }>(this.userApiUrl, { headers });
  }

  /**
   * Logs out the user by removing authentication token.
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  }

  /**
   * Retrieves stored authentication token.
   * @returns Token string or null if not found
   */
  private getToken(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem('token') || sessionStorage.getItem('token')
      : null;
  }

  /**
   * Stores authentication token in either localStorage or sessionStorage.
   * @param token - Authentication token
   * @param rememberMe - Whether to store in localStorage or sessionStorage
   */
  private storeToken(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  }

  /**
   * Stores user role in localStorage.
   * @param role - User role
   */
  private storeUserRole(role: string): void {
    localStorage.setItem('userRole', role);
  }
}
