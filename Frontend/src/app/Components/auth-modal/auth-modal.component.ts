import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LoginFormComponent } from '../login-form/login-form.component';
//import { RegisterFormComponent } from '../register-form/register-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from '../../Services/auth/auth.service';

@Component({
  selector: 'app-auth-modal',
  imports: [CommonModule, FontAwesomeModule, LoginFormComponent, /*RegisterFormComponent*/],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css',
})
export class AuthModalComponent implements AfterViewInit {
 // Active tab state determines which form (login or register) is displayed.
  activeTab: 'login' | 'register' = 'login';
   // FontAwesome icons for Facebook and Google buttons.
  faFacebook = faFacebook;
  faGoogle = faGoogle;
  // Flag to indicate if third-party auth buttons are ready to be displayed.
  isButtonReady = false;

  constructor(
    // PLATFORM_ID is injected to determine if code is running in a browser.
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService
  ) {}

  /**
   * Switches between the login and register tabs.
   * 
   * @param tab - The tab to display ('login' or 'register').
   */
  showTab(tab: 'login' | 'register') {
    this.activeTab = tab;
  }

  /**
   * Lifecycle hook that is called after the component's view has been fully initialized.
   * Here, we initialize third-party authentication services (Facebook and Google)
   * only if the code is running in a browser.
   */
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize third-party authentication services.
      this.authService.initializeAuth();
      // Set a short delay to ensure that external authentication buttons are fully initialized.
      setTimeout(() => {
        this.isButtonReady = true;
      }, 1000);
    }
  }

  /**
   * Triggers the Google sign-in process by calling the AuthService.
   */
  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  /**
   * Triggers the Facebook sign-in process.
   * On a successful login, it logs the user info and displays a welcome message.
   * If an error occurs, it logs the error.
   */
  loginWithFacebook() {
    this.authService.loginWithFacebook().then(
      (userInfo) => {
        console.log('User Info:', userInfo);
        alert(`Welcome ${userInfo.name}`);
      },
      (error) => {
        console.error('Facebook Login Error:', error);
      }
    );
  }
}
