import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AutoFocusDirective } from '../../../../shared/directives/auto-focus/auto-focus.directive';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

/**
 * Component for handling user login functionality.
 */
@Component({
  selector: 'app-login-form',
  imports: [FormsModule, CommonModule, AutoFocusDirective, HttpClientModule, ForgotPasswordComponent],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  providers: [AuthService]
})
export class LoginFormComponent implements OnInit {
  
  /** Reference to the login form */
  @ViewChild('loginForm') loginForm!: NgForm;

  /** User credentials */
  email: string = '';
  password: string = '';
  isChecked: boolean = false;

  /** UI State Management */
  showPassword = false;
  isLoading: boolean = false;
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
    private navigationService: NavigationService
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
   * Toggles the visibility of the password field.
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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

    this.isLoading = true;
    this.loginError = false;

    this.authService.login(this.email, this.password, this.isChecked).subscribe({
      next: response => {
        this.navigationService.navigateByRole(response.user.role);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.loginError = true;
      }
    });
  }

  /**
   * Checks if the user is already authenticated on component initialization.
   */
  ngOnInit(): void {
    this.authService.checkAuthStatus().subscribe({
      next: response => {
        if (response.valid) {
          this.navigationService.navigateByRole(response.user.role);
        } else {
          this.authService.logout();
        }
      },
      error: () => this.authService.logout()
    });
  }
}
