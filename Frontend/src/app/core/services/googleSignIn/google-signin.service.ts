import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  // Holds the Google sign-in client instance after initialization.
  private client: any;
  private isClientReady = false;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  initializeGoogleSignIn(callback: (response: any) => void) {
    if (!this.isBrowser) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      (window as any).google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: callback,
      });

      (window as any).google.accounts.id.prompt();
    };

    script.onerror = (error: any) => {
      console.error('Failed to load the Google Sign-In script:', error);
    };

    document.head.appendChild(script);
  }

  triggerGoogleLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.isClientReady && this.client) {
        this.client.callback = (response: any) => {
          if (response?.error) {
            reject(response.error);
          } else if (response.code) {
            resolve(response);
          } else {
            reject('Authorization code not received.');
          }
        };

        this.client.requestCode();
      } else {
        reject('Google client not initialized.');
      }
    });
  }
}
