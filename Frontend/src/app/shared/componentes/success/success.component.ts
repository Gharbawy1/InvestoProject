import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-success',
  imports: [ButtonComponent, RouterLink],
  template: `
    <div class="text-center mt-20">
      <h1 class="text-3xl font-bold text-green-600">✅ Success</h1>
      <p class="mt-4 text-gray-600">{{ message }}</p>
      <button-component
        [variant]="'outline'"
        routerLink="/Home"
        class="mt-6 inline-block text-blue-600 underline"
        >Go to Homepage</button-component
      >
    </div>
  `,
  styleUrl: './success.component.css',
})
export class SuccessComponent {
  message = 'Everything went well.';

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      if (params['message']) {
        this.message = params['message'];
      }
    });
  }
}
