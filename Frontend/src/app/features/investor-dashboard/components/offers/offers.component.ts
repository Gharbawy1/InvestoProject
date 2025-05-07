import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment/payment.service';
import { ButtonComponent } from '../../../../shared/componentes/button/button.component';

@Component({
  selector: 'app-offers',
  imports: [ButtonComponent],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css',
})
export class OffersComponent {
  projectId: string = '11';
  offerId: string = '51';
  router = Inject(Router);

  /**
   *
   */
  constructor(private paymentService: PaymentService) {}
  payNow() {
    this.paymentService
      .createCheckoutSession(this.projectId, this.offerId)
      .subscribe({
        next: (res: { sessionUrl: string }) => {
          if (res && res.sessionUrl) {
            window.location.href = res.sessionUrl;
          } else {
            this.showError('Unexpected response from server.');
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  showError(message: string) {
    this.router.navigate(['error'], { queryParams: { message } });
  }
}
