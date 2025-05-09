import { Component, Inject, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaymentService } from '../../services/payment/payment.service';
import { ButtonComponent } from '../../../../shared/componentes/button/button.component';
import { ToastrService } from 'ngx-toastr';
import { loadStripe } from '@stripe/stripe-js';
import { CommonModule } from '@angular/common';
import { IOfferProfile } from '../../../project/interfaces/IOfferProfile';

@Component({
  selector: 'app-offers',
  imports: [CommonModule, ButtonComponent, RouterLink],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css',
})
export class OffersComponent {
  @Input() offers: IOfferProfile[] = [];
  router = Inject(Router);

  /**
   *
   */
  constructor(
    private paymentService: PaymentService,
    private toastr: ToastrService
  ) {}
  payNow(projectId: number, offerId: number) {
    this.paymentService.createCheckoutSession(projectId, offerId).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.redirectToCheckout(res.data);
        } else {
          this.showError('Unexpected response from server.');
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  async redirectToCheckout(sessionId: string) {
    const stripe = await loadStripe(
      'pk_test_51RK8SqBSIODkDI0LRRFt7XSltCZoJvjDbt0I63XhPzfTBVuSop4ydwCLLpFXNhuebLDCEblkaiGENRPUTvWzatT800vWBSLPMD'
    );

    if (!stripe) {
      this.toastr.error('Stripe failed to load', 'Error');
      return;
    }

    const result = await stripe.redirectToCheckout({ sessionId });

    if (result.error) {
      this.toastr.error(result.error.message, 'Error');
    }
  }
  showError(message: string) {
    this.router.navigate(['error'], { queryParams: { message } });
  }
}
