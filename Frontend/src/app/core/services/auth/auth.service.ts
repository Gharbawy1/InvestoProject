import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { FacebookAuthService } from '../FacebookSignIn/facebook-auth.service';
import { GoogleAuthService } from '../googleSignIn/google-signin.service';
import { environment } from '../../../../environments/environment.development';

// Define the shape of the authentication response from the server.
export interface AuthResponse {
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
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object,
    private fbAuthService: FacebookAuthService,
    private googleAuthService: GoogleAuthService
  ) {}

  /**
   * Logs in the user using email and password.
   * On success, it stores the authentication token and user role.
   *
   * @param email - The user's email.
   * @param password - The user's password.
   * @param rememberMe - If true, token is stored in localStorage; otherwise, sessionStorage.
   * @returns An Observable that emits the authentication response.
   */
  login(email: string, password: string, rememberMe: boolean): Observable<AuthResponse> {
    // Remove extra spaces from credentials.
    const credentials = { email: email.trim(), password: password.trim() };

    return this.http.post<AuthResponse>(`${environment.apiBase}/login`, credentials).pipe(
      tap(response => {
        // Save token and user role only in the browser.
        if (isPlatformBrowser(this.platformId)) {
          this.storeToken(response.token, rememberMe);
          this.storeUserRole(response.user.role);
          this.storeUserId(response.user.id);
          this.storeUserData('currentUser', response.user, rememberMe);
        }
      }),
      catchError(error => {
        const errorMessage = error.error?.message || 'Invalid credentials';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Sends password reset link to user email.
   * 
   * @param email - User email.
   * @returns An Observable with the server's response.
   */
  sendResetLink(email: string): Observable<any> {
    return this.http.post(environment.userApiUrl, { email: email.trim() }).pipe(
      catchError(error => {
        console.error('Error sending reset link:', error);
        return throwError(error);
      })
    );
  }

  /**
   * Checks if the current user session is valid by verifying the stored token.
   * 
   *  @returns An Observable that emits an object containing the validity status and user role.
   */
  checkAuthStatus(): Observable<{ valid: boolean; user: { role: string } }> {
    // This operation is only valid in a browser environment.
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('Not in browser environment'));
    }

    const token = this.getToken();
    if (!token) {
      return throwError('No authentication token found');
    }

    // Attach the token in the Authorization header.
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<{ valid: boolean; user: { role: string } }>(environment.userApiUrl, { headers }).pipe(
      catchError(error => {
        console.error('Error checking authentication status:', error);
        return throwError(error);
      })
    );
  }

  /**
 * Logs out the user by removing the authentication token from storage.
 */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Clear all auth-related storage
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('userRole');
    }
  }

  /**
   * Retrieves the stored authentication token from localStorage or sessionStorage.
   * 
   * @returns The token string if available; otherwise, null.
   */
  private getToken(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem('token') || sessionStorage.getItem('token')
      : null;
  }

  /**
   * Stores the authentication token in either localStorage or sessionStorage.
   * 
   * @param token - The authentication token.
   * @param rememberMe - If true, token is stored in localStorage; else in sessionStorage.
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
   * 
   * @param role - The user's role.
   */
  private storeUserRole(role: string): void {
    localStorage.setItem('userRole', role);
  }

  /**
   * Stores user ID in localStorage.
   * 
   * @param id - The user's ID.
   */
  storeUserId(id: number) {
    localStorage.setItem('userId', id.toString());
  }

  /**
   * Stores user data.
   * 
   * @param key - The key under which to store the data.
   * @param value - The data to store.
   * @param rememberMe - If true, data is stored in localStorage; else in sessionStorage.
   */
  storeUserData(key: string, value: any, rememberMe: boolean) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  }

  getUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? +id : null;
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Initializes third-party authentication services (Facebook and Google).
   * This method should be called during application initialization.
   */
  initializeAuth() {
    // Initialize Facebook authentication.
    this.fbAuthService.initializeFacebook().catch(error => {
      console.error('Error initializing Facebook SDK:', error);
    });

    // Initialize Google authentication.
    // The callback 'handleGoogleLogin' will handle the response after Google sign-in.
    this.googleAuthService.initializeGoogleSignIn(this.handleGoogleLogin.bind(this));
  }

  /**
   * Initiates the Facebook login process.
   *
   * @returns A Promise that resolves with the Facebook user information upon a successful login.
   */
  loginWithFacebook() {
    return this.fbAuthService.fbLogin();
  }
  
  /**
   * Initiates the Google login process.
   */
  loginWithGoogle() {
    this.googleAuthService.triggerGoogleLogin();
  }
  
  /**
   * Callback to handle the Google sign-in response.
   * It exchanges the Google authorization code for an authentication token.
   *
   * @param response - The response object from Google containing the authorization code.
   */
  private handleGoogleLogin(response: any) {
    console.log('Google Login Response:', response);

    // Exchange the Google authorization code for an application-specific authentication token.
    this.http.post<AuthResponse>(`${environment.userApiUrl}/google-auth`, { code: response.code })
      .pipe(
        tap((authResponse) => {
          if (isPlatformBrowser(this.platformId)) {
             // By default, store token in localStorage (rememberMe set to true).
            this.storeToken(authResponse.token, true);
            this.storeUserRole(authResponse.user.role);
          }
        }),
        catchError(error => {
          console.error('Google login failed:', error);
          return throwError(error);
        })
      )
      .subscribe({
        next: () => {
          // Perform any additional actions after successful login (e.g., redirecting the user).
          console.log('Google login successful.');

        },
        error: (err) => {
          console.error('Error during Google login process:', err);
        }
      });
  }
}
