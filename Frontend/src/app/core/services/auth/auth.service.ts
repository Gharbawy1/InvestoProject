import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment.development';
import { tap, catchError } from 'rxjs/operators';
import { LoginResponse } from '../../interfaces/LoginResponse';
import { UserDetails } from '../../interfaces/UserDetails';

// Define the shape of the authentication response from the server.

export interface User {
  id: string;
  role: string;
  profilePicture: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BehaviorSubject holding current user; initialized from storage if exists
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  isBrowser: boolean;
  /**
   * Observable stream of the current authenticated user (or null if not logged in)
   */
  private userSubject = new BehaviorSubject<UserDetails | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    // Seed the current user from storage on service initialization
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      // this.initializeAuth();
      const storedUser = this.getStoredUser();
      if (storedUser) {
        this.userSubject.next(storedUser);
      }

      if (this.hasToken()) {
        this.isLoggedInSubject.next(true);
      }
    }
  }

  private createUserFromAuthResponse(response: LoginResponse): UserDetails {
    return {
      id: response.userId,
      firstName: response.firstName,
      lastName: response.lastName,
      role: response.roles[0] || 'User',
      profilePictureURL: response.profilePictureURL,
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
  ): Observable<LoginResponse> {
    // Remove extra spaces from credentials.
    const credentials = { email: email.trim(), password: password.trim() };

    return this.http
      .post<LoginResponse>(
        `${environment.baseApi}${environment.account.login}`,
        credentials
      )
      .pipe(
        tap((response) => {
          if (this.isBrowser) {
            // Store JWT token
            this.storeToken(response.token, rememberMe);
            const user = this.createUserFromAuthResponse(response);
            // Store serialized user object
            this.storeUserData('currentUser', user, rememberMe);
            // Emit new user value to all subscribers
            this.userSubject.next(user);
            this.isLoggedInSubject.next(true);
          }
        }),
        catchError((error) => {
          const errorMessage = error.error?.message || 'Invalid credentials';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  createCurrentUser(response: any, rememberMe: any) {
    if (this.isBrowser) {
      // Store JWT token
      this.storeToken(response.token, rememberMe);
      const user = {
        id: response.userId,
        firstName: response.userName,
        role: response.roles[0],
        profilePictureURL: response.profilePicture,
      };
      // Store serialized user object
      this.storeUserData('currentUser', user, rememberMe);
      // Emit new user value to all subscribers
      this.isLoggedInSubject.next(true);
    }
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
    if (!this.isBrowser) {
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
    if (this.isBrowser) {
      // Remove token & user data from both storages
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
      // Emit null to indicate no user is logged in
      this.userSubject.next(null);
      this.isLoggedInSubject.next(false);
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
  getCurrentUser(): UserDetails | null {
    return this.getStoredUser();
  }

  /**
   * Retrieves stored user object from storage.
   * @returns parsed user object or null.
   */
  private getStoredUser(): UserDetails | null {
    if (!this.isBrowser) return null;
    const raw =
      localStorage.getItem('currentUser') ||
      sessionStorage.getItem('currentUser');
    return raw ? (JSON.parse(raw) as UserDetails) : null;
  }

  /**
   * Retrieves JWT token from storage.
   * @returns The token string if available; otherwise, null.
   */
  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('token') || sessionStorage.getItem('token');
    }
    return null;
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Stores the JWT token in localStorage or sessionStorage.
   * @param token - JWT token string.
   * @param rememberMe - If true, token is stored in localStorage; else in sessionStorage.
   */
  public storeToken(token: string, rememberMe: boolean): void {
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
  // initializeAuth() {
  //   // Initialize Facebook authentication.
  //   this.fbAuthService.initializeFacebook().catch((error) => {
  //     console.error('Error initializing Facebook SDK:', error);
  //   });

  // Initialize Google authentication.
  // The callback 'handleGoogleLogin' will handle the response after Google sign-in.
  // this.googleAuthService.initializeGoogleSignIn(
  //   this.handleGoogleLogin.bind(this)
  // );
  // }

  /**
   * Initiates the Facebook login process.
   * @returns A Promise that resolves with the Facebook user information upon a successful login.
   */
  // loginWithFacebook() {
  //   return this.fbAuthService.fbLogin();
  // }

  /**
   * Initiates the Google login process.
   */
  // loginWithGoogle(): Promise<any> {
  //   return this.googleAuthService.triggerGoogleLogin();
  // }

  private toPascalKeyPath(key: string): string {
    return key
      .split('.') // يفصل على حسب الـ dot
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('.');
  }

  /**
   * Callback for Google sign-in: exchanges code for AuthResponse, stores token & user.
   * @param response - Google callback containing auth code.
   */
  handleGoogleLogin(data: FormData): Observable<any> {
    for (const [key, value] of data.entries()) {
      console.log(`${key}:`, value);
      if (value instanceof FormData) {
        for (const [key1, value1] of value.entries()) {
          console.log(`${key1}:`, value1);
        }
      }
    }
    debugger;
    return this.http
      .post<LoginResponse>(
        `${environment.baseApi}${environment.account.googleLogin}`,
        data
      )
      .pipe(
        tap((response) => {
          console.log(response);
          debugger;
        }),
        catchError((error) => {
          console.error('Error logging in with Google:', error);
          debugger;
          return throwError(() => error);
        })
      );
  }
}
