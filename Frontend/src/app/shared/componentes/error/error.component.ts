import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-error',
  imports: [ButtonComponent, RouterLink],
  template: `
    <div class="text-center mt-20">
      <h1 class="text-3xl font-bold text-red-600">❌ Error</h1>
      <p class="mt-4 text-gray-600">
        {{ message }}
      </p>
      <button-component [variant]="'outline'" routerLink="/Home" class="m-4"
        >Go to Homepage</button-component
      >
    </div>
  `,
  styleUrl: './error.component.css',
})
export class ErrorComponent {
  message = 'An error occurred.';

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      if (params['message']) {
        this.message = params['message'];
      }
    });
  }
}
