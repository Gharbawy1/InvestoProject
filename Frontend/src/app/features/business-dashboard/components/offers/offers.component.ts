import { Component, Inject, Input } from '@angular/core';
import { IOfferProfile } from '../../../project/interfaces/IOfferProfile';
import { CommonModule } from '@angular/common';
import { OfferService } from '../../../project/services/offer/offer.service';

@Component({
  selector: 'app-offers',
  imports: [CommonModule],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css',
})
export class OffersComponent {
  @Input() offers: IOfferProfile[] = [];
  offerService: OfferService = Inject(OfferService);
  acceptOffer(offerId: number): void {
    this.offerService.changeOfferStatus(offerId, 'Accepted').subscribe({
      next: () => {
        const offer = this.offers.find((o) => o.offerId === offerId);
        if (offer && offer.status === 'Pending') {
          offer.status = 'Accepted';
        }
      },
      error: (err) => console.log(err),
    });
  }

  rejectOffer(offerId: number): void {
    this.offerService.changeOfferStatus(offerId, 'Rejected').subscribe({
      next: () => {
        const offer = this.offers.find((o) => o.offerId === offerId);
        if (offer && offer.status === 'Pending') {
          offer.status = 'Rejected';
        }
      },
      error: (err) => console.log(err),
    });
  }
}
