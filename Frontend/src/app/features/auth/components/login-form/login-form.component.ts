import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AutoFocusDirective } from '../../../../shared/directives/auto-focus/auto-focus.directive';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { EyePasswordComponent } from '../../../../shared/componentes/eye-password/eye-password.component';
import { GoogleAuthService } from '../../../../core/services/googleSignIn/google-signin.service';
import { Router } from '@angular/router';

/**
 * Component for handling user login functionality.
 */
@Component({
  selector: 'app-login-form',
  imports: [
    FormsModule,
    CommonModule,
    AutoFocusDirective,
    HttpClientModule,
    ForgotPasswordComponent,
    EyePasswordComponent,
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  /** Reference to the login form */
  @ViewChild('loginForm') loginForm!: NgForm;

  /** User credentials */
  email: string = '';
  password: string = '';
  isChecked: boolean = false;

  /** UI State Management */
  showPassword: boolean = false;
  formSubmitted: boolean = false;
  loginError: boolean = false;

  /** Forgot Password Modal State */
  isForgotPasswordOpen: boolean = false;

  /**
   * Initializes the component with necessary services.
   * @param {AuthService} authService - Handles authentication.
   * @param {NavigationService} navigationService - Handles navigation based on user role.
   */
  constructor(
    private authService: AuthService,
    private navigationService: NavigationService,
    private googleAuthService: GoogleAuthService,
    private router: Router
  ) {}

  /**
   * Opens the forgot password modal and resets its state.
   */
  openForgotPassword(): void {
    this.isForgotPasswordOpen = true;
  }

  handleCloseModal() {
    this.isForgotPasswordOpen = false;
  }

  /**
   * Toggles the "Remember Me" option.
   */
  toggleRememberMe(): void {
    this.isChecked = !this.isChecked;
  }

  /**
   * Handles user login and redirects based on their role.
   */
  login(): void {
    this.formSubmitted = true;

    if (this.loginForm.invalid) return;

    this.loginError = false;

    this.authService
      .login(this.email, this.password, this.isChecked)
      .subscribe({
        next: (response) => {
          const role = response.roles?.[0];
          if (role) {
            this.navigationService.navigateByRole(role);
          } else {
            console.error('No roles in login response', response);
            this.loginError = true;
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.loginError = true;
        },
      });
  }

  loginWithGoogle() {
    debugger;
    this.googleAuthService.initializeGoogleSignIn((response: any) => {
      debugger;
      if (response.credential) {
        const IdToken = response.credential;
        const LoginFormDate = new FormData();
        LoginFormDate.append('IdToken', IdToken);
        LoginFormDate.append('Role', 'User');
        console.log('Received ID Token:', IdToken);
        debugger;
        this.authService.handleGoogleLogin(LoginFormDate).subscribe({
          next: (response) => {
            console.log(response);
            debugger;
            this.authService.createCurrentUser(response, true);
            this.router.navigate(['/Home']);
          },
          error: (error) => {
            console.error('Error occurred:', error);
            debugger;
          },
        });
      }
    });
  }

  /**
   * Checks if the user is already authenticated on component initialization.
   */
  ngOnInit(): void {
    this.authService.checkAuthStatus().subscribe({
      next: (response) => {
        if (response.valid) {
          this.navigationService.navigateByRole(response.user.role);
        } else {
          this.authService.logout();
        }
      },
      error: () => this.authService.logout(),
    });
  }
}
