import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LoginFormComponent } from '../../features/auth/components/login-form/login-form.component';
import { RegistrationFormComponent } from '../../features/auth/components/registration-form/registration-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from '../../core/services/auth/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-auth-modal',
  imports: [
    CommonModule,
    FontAwesomeModule,
    LoginFormComponent,
    RegistrationFormComponent,
    RouterLink,
    MatIcon,
  ],
  templateUrl: './auth-model.component.html',
  styleUrl: './auth-model.component.css',
})
export class AuthModelComponent implements AfterViewInit {
  // Active tab state determines which form (login or register) is displayed.
  activeTab: 'login' | 'register' = 'login';
  // FontAwesome icons for Facebook and Google buttons.
  faFacebook = faFacebook;
  faGoogle = faGoogle;
  // Flag to indicate if third-party auth buttons are ready to be displayed.
  isButtonReady = false;

  constructor(
    // PLATFORM_ID is injected to determine if code is running in a browser.
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Switches between the login and register tabs.
   *
   * @param tab - The tab to display ('login' or 'register').
   */
  showTab(tab: 'login' | 'register') {
    this.activeTab = tab;
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Set a short delay to ensure that external authentication buttons are fully initialized.
      setTimeout(() => {
        this.isButtonReady = true;
      }, 1000);
    }
  }
}
