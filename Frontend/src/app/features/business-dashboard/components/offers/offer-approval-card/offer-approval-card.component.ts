import { Component, inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { OfferService } from '../../../../project/services/offer/offer.service';
import { MatDialog } from '@angular/material/dialog';
import { IOfferProfile } from '../../../../project/interfaces/IOfferProfile';
import { OfferDetailsDialogComponent } from '../offer-details-dialog/offer-details-dialog.component';

@Component({
  selector: 'app-offer-approval-card',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './offer-approval-card.component.html',
  styleUrls: ['./offer-approval-card.component.css']
})
export class OfferApprovalCardComponent {
  @Input() offers: IOfferProfile[] = [];
  @ViewChild('detailsModal') detailsModal!: TemplateRef<any>;
  
  isLoading = false;

  private offerService = inject(OfferService);

  constructor(private dialog: MatDialog) {}

  error: string | null = null;

  statusFilters: ('Pending' | 'Accepted' | 'Rejected')[] = ['Pending', 'Accepted', 'Rejected'];
  filterStatus: 'Pending' | 'Accepted' | 'Rejected' = 'Pending';

  get filteredOffers() {
    return this.offers.filter(offer => offer.status === this.filterStatus);
  }

  get emptyStateMessage() {
    return `No ${this.filterStatus.toLowerCase()} offers found`;
  }

  handleStatusChange(id: number, newStatus: 'Accepted' | 'Rejected') {
    const offer = this.offers.find(o => o.offerId === id);
    if (!offer || offer.status !== 'Pending') return;
  
    const oldStatus = offer.status;

    offer.status = newStatus;
  
    this.offerService.changeOfferStatus(id, newStatus).subscribe({
      error: () => {
        this.error = 'Status update failed; reverting.';

        offer.status = oldStatus;
      }
    });
  }

  openDetailsModal(offer: IOfferProfile) {
    const dialogRef = this.dialog.open(OfferDetailsDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: offer
    });

    dialogRef.componentInstance.statusChanged.subscribe(({ id, status }) => {
      this.handleStatusChange(id, status);
    });
  }

  getBadge(status?: string) {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}