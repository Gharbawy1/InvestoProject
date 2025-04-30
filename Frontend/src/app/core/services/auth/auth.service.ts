import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { FacebookAuthService } from '../FacebookSignIn/facebook-auth.service';
import { GoogleAuthService } from '../googleSignIn/google-signin.service';
import { environment } from '../../../../environments/environment.development';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { UserDetails } from '../../../features/project/services/business-details/business-details.service';
import { AuthResponse } from '../../interfaces/AuthResponse';

// Define the shape of the authentication response from the server.

export interface User {
  id: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BehaviorSubject holding current user; initialized from storage if exists
  private userSubject = new BehaviorSubject<User | null>(null);
  currentUserSig = signal<AuthResponse | undefined | null>(undefined);

  /**
   * Observable stream of the current authenticated user (or null if not logged in)
   */
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private fbAuthService: FacebookAuthService,
    private googleAuthService: GoogleAuthService
  ) {
    // Seed the current user from storage on service initialization
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = this.getStoredUser();
      if (storedUser) {
        this.userSubject.next(storedUser);
      }
    }
  }

  private createUserFromAuthResponse(response: AuthResponse): User {
    return {
      id: response.userId,
      name: `${response.firstName} ${response.lastName}`,
      role: response.roles[0] || 'user',
    };
  }

  /**
   * Logs in the user using email and password.
   * On success, it stores the authentication token and user role.
   *
   * @param email - The user's email.
   * @param password - The user's password.
   * @param rememberMe - If true, token is stored in localStorage; otherwise, sessionStorage.
   * @returns An Observable that emits the authentication response.
   */
  login(
    email: string,
    password: string,
    rememberMe: boolean
  ): Observable<AuthResponse> {
    // Remove extra spaces from credentials.
    const credentials = { email: email.trim(), password: password.trim() };

    return this.http
      .post<AuthResponse>(
        `${environment.baseApi}${environment.account.login}`,
        credentials
      )
      .pipe(
        tap((response) => {
          if (isPlatformBrowser(this.platformId)) {
            // Store JWT token
            this.storeToken(response.token, rememberMe);
            const user = this.createUserFromAuthResponse(response);
            // Store serialized user object
            this.storeUserData('currentUser', user, rememberMe);
            // Emit new user value to all subscribers
            this.userSubject.next(user);
          }
        }),
        catchError((error) => {
          const errorMessage = error.error?.message || 'Invalid credentials';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  /**
   * Sends password reset link to user email.
   * @param email - User email.
   * @returns An Observable with the server's response.
   */
  /*sendResetLink(email: string): Observable<any> {
    return this.http.post(environment.userApiUrl, { email: email.trim() }).pipe(
      catchError(error => {
        console.error('Error sending reset link:', error);
        return throwError(() => error);
      })
    );
  }*/

  /**
   *  Verifies stored token by calling the server.
   *  @returns An Observable that emits an object containing the validity status and user role.
   */
  checkAuthStatus(): Observable<{ valid: boolean; user: { role: string } }> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('Not in browser environment'));
    }

    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }

    // Attach the token in the Authorization header.
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<{ valid: boolean; user: { role: string } }>(
        environment.account.accountUrl,
        {
          headers,
        }
      )
      .pipe(
        catchError((error) => {
          console.error('Error checking authentication status:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Logs out the user: clears storage, resets subject, and redirects to login.
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Remove token & user data from both storages
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
      // Emit null to indicate no user is logged in
      this.userSubject.next(null);
      // Navigate to login screen
      this.router.navigate(['/auth']);
    }
  }

  /**
   * Returns the user ID from Storage
   */
  getUserId(): string | null {
    const currentUser = this.getStoredUser();
    return currentUser ? currentUser.id : null;
  }

  /**
   * Returns the currentUser object
   */
  getCurrentUser(): User | null {
    return this.getStoredUser();
  }

  /**
   * Retrieves stored user object from storage.
   * @returns parsed user object or null.
   */
  private getStoredUser(): User | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const raw =
      localStorage.getItem('currentUser') ||
      sessionStorage.getItem('currentUser');
    return raw ? (JSON.parse(raw) as User) : null;
  }

  /**
   * Retrieves JWT token from storage.
   * @returns The token string if available; otherwise, null.
   */
  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  /**
   * Stores the JWT token in localStorage or sessionStorage.
   * @param token - JWT token string.
   * @param rememberMe - If true, token is stored in localStorage; else in sessionStorage.
   */
  private storeToken(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem('token', token);
      sessionStorage.removeItem('token');
    } else {
      sessionStorage.setItem('token', token);
      localStorage.removeItem('token');
    }
  }

  /**
   * Stores user data under a given key in the chosen storage.
   * @param key - storage key name.
   * @param value - data to serialize and store.
   * @param rememberMe - if true, use localStorage; else sessionStorage.
   */
  storeUserData(key: string, value: any, rememberMe: boolean): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(key, JSON.stringify(value));
    (rememberMe ? sessionStorage : localStorage).removeItem(key);
  }

  //get user by ID
  getUserById(id: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${environment.userApiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching user:', error);
        return throwError(() => new Error('Failed to fetch user details'));
      })
    );
  }

  /**
   * Initializes third-party authentication services (Facebook and Google).
   * This method should be called during application initialization.
   */
  initializeAuth() {
    // Initialize Facebook authentication.
    this.fbAuthService.initializeFacebook().catch((error) => {
      console.error('Error initializing Facebook SDK:', error);
    });

    // Initialize Google authentication.
    // The callback 'handleGoogleLogin' will handle the response after Google sign-in.
    this.googleAuthService.initializeGoogleSignIn(
      this.handleGoogleLogin.bind(this)
    );
  }

  /**
   * Initiates the Facebook login process.
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
   * Callback for Google sign-in: exchanges code for AuthResponse, stores token & user.
   * @param response - Google callback containing auth code.
   */
  private handleGoogleLogin(response: any): void {
    console.log('Google Login Response:', response);
    this.http
      .post<AuthResponse>(`${environment.userApiUrl}/google-auth`, {
        code: response.code,
      })
      .pipe(
        tap((authResponse) => {
          if (isPlatformBrowser(this.platformId)) {
            this.storeToken(authResponse.token, true);
            const user = this.createUserFromAuthResponse(authResponse);
            this.storeUserData('currentUser', user, true);
            this.userSubject.next(user);
          }
        }),
        catchError((error) => {
          console.error('Google login failed:', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: () => console.log('Google login successful.'),
        error: (err) =>
          console.error('Error during Google login process:', err),
      });
  }
}
