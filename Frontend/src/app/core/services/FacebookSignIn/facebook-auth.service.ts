import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

// Extend the Window interface to include fbAsyncInit.
declare global {
  interface Window {
    fbAsyncInit: () => void;
  }
}

// Declare the global FB object provided by the Facebook SDK.
declare var FB: any;

@Injectable({
  providedIn: 'root',
})
export class FacebookAuthService {
  constructor() {}

  /**
   * Initializes the Facebook SDK by dynamically loading the SDK script into the document.
   * Returns a Promise that resolves once the SDK is successfully loaded and initialized.
   *
   * @returns Promise that resolves when the Facebook SDK is ready.
   */
  initializeFacebook() {
    return new Promise<void>((resolve, reject) => {
      // If the SDK is already loaded, resolve immediately.
      if (typeof FB !== 'undefined') {
        resolve();
        return;
      }

      // Define the callback function that Facebook will call once the SDK is loaded.
      window.fbAsyncInit = () => {
        FB.init({
          appId: environment.appId,
          cookie: true, // Enable cookies to allow the server to access the session.
          xfbml: true, // Parse social plugins on this webpage.
          version: 'v18.0',
        });
        resolve(); // Resolve the promise once initialization is complete.
      };

      // Dynamically load the Facebook SDK script.
      (function (d, s, id) {
        const fjs = d.getElementsByTagName(s)[0];
        // Avoid loading the script twice.
        if (d.getElementById(id)) {
          return;
        }
        // Create a new script element.
        const js: HTMLScriptElement = d.createElement(s) as HTMLScriptElement;
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        js.async = true;
        js.defer = true;

        // Handle any error during the script load.
        js.onerror = (error: any) => {
          console.error('Failed to load the Facebook SDK:', error);
          reject('Failed to load the Facebook SDK');
        };

         // Insert the script element before the first script element in the document.
         fjs.parentNode?.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    });
  }

  /**
   * Triggers the Facebook login process.
   * Returns a Promise that resolves with the user's information upon a successful login,
   * or rejects if the login is cancelled or authorization fails.
   *
   * @returns Promise that resolves with user info (e.g., name, email) if login succeeds.
   */
  fbLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Start the login process and request the 'email' permission.
      FB.login(
        (response: any) => {
           // If the login is successful and the authResponse exists.
          if (response.authResponse) {
            resolve(response.authResponse); // Send this token to your backend
          } else {
            // If the user cancels the login or did not authorize.
            reject('User cancelled login or did not authorize.');
          }
        },
        { scope: 'email' } // Request permission to access the user's email.
      );
    });
  }
}