import { Component, inject, Inject, Input } from '@angular/core';
import { IOfferProfile } from '../../../project/interfaces/IOfferProfile';
import { CommonModule } from '@angular/common';
import { OfferService } from '../../../project/services/offer/offer.service';
import { OfferApprovalCardComponent } from './offer-approval-card/offer-approval-card.component';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-offers',
  imports: [CommonModule, MatIconModule, OfferApprovalCardComponent],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css',
})
export class OffersComponent {
  private route = inject(ActivatedRoute);
  private offerService = inject(OfferService);
  offers: IOfferProfile[] = [];
  isLoading = true;
  error: string | null = null;
  projectId!: number;

  ngOnInit(): void {
    this.projectId = Number(localStorage.getItem('projectId') || sessionStorage.getItem('projectId'));
    this.offerService.getOfferforProject(this.projectId).subscribe({
      next: (res) => {
        this.offers = res;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load offers.';
        this.isLoading = false;
      },
    });
  }
}
