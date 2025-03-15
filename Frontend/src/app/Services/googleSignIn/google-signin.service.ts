import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  // Holds the Google sign-in client instance after initialization.
  private client: any;

  constructor() {}

 /**
   * Initializes the Google Sign-In client by dynamically loading the Google Identity Services script.
   * This method sets up the client for triggering the OAuth flow.
   *
   * @param callback A function to be executed once the Google sign-in flow returns a response.
   */
  initializeGoogleSignIn(callback: (response: any) => void) {
    // Check if the Google script has already been loaded
    if ((window as any).google && (window as any).google.accounts) {
      // If already loaded, initialize the client directly.
      this.client = (window as any).google.accounts.oauth2.initCodeClient({
        client_id: environment.googleClientId,
        scope: 'email profile openid',
        ux_mode: 'popup',
        callback: callback,
      });
      return;
    }

    // Create the script element for the Google Identity Services library.
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    // When the script loads, initialize the Google OAuth client.
    script.onload = () => {
      if ((window as any).google && (window as any).google.accounts) {
        this.client = (window as any).google.accounts.oauth2.initCodeClient({
          client_id: environment.googleClientId,
          scope: 'email profile openid',
          ux_mode: 'popup',
          callback: callback,
        });
      } else {
        console.error('Google Accounts library is not available after script load.');
      }
    };

    // Handle any errors that occur while loading the script.
    script.onerror = (error: any) => {
      console.error('Failed to load the Google Sign-In script:', error);
    };

    // Append the script element to the document head to start loading.
    document.head.appendChild(script);
  }

 /**
   * Triggers the Google login process by requesting an authorization code.
   * Make sure to call `initializeGoogleSignIn()` before calling this method.
   */
  triggerGoogleLogin(): void {
    if (this.client) {
      this.client.requestCode();
    } else {
      console.error('Google client not initialized. Please call initializeGoogleSignIn() first.');
    }
  }
}
