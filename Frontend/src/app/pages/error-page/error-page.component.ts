import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-page',
  template: `
    <div class="error">
      <h1>Something went wrong</h1>
      <p>{{message || 'An unexpected error occurred.'}}</p>
    </div>
  `
})
export class ErrorPageComponent {
  message?: string;
}

