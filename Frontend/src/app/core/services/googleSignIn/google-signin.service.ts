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

    const setupClient = () => {
      this.client = (window as any).google.accounts.oauth2.initCodeClient({
        client_id: environment.googleClientId,
        scope: 'openid email profile',
        redirect_uri: 'postmessage', // Required for exchanging in backend
        callback: callback, // Will receive `{ code }`
      });
      this.isClientReady = true;
    };

    if ((window as any).google?.accounts?.oauth2) {
      setupClient();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if ((window as any).google?.accounts?.oauth2) {
        setupClient();
      } else {
        console.error(
          'Google Accounts library not available after script load.'
        );
      }
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
