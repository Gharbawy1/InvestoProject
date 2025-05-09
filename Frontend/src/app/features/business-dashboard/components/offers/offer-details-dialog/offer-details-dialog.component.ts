import { Component, Inject, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IOfferProfile } from '../../../../project/interfaces/IOfferProfile';
import { MatIconModule } from '@angular/material/icon';
import { OfferService } from '../../../../project/services/offer/offer.service';

@Component({
  selector: 'app-offer-details-dialog',
  imports: [MatIconModule, CommonModule],
  templateUrl: './offer-details-dialog.component.html',
  styleUrls: ['./offer-details-dialog.component.css']
})
export class OfferDetailsDialogComponent {
  @Output() statusChanged = new EventEmitter<{ id: number, status: 'Accepted' | 'Rejected' }>();

  @Input() projectId!: number;

  offers: IOfferProfile[] = [];

  constructor(
    public dialogRef: MatDialogRef<OfferDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public offer: IOfferProfile
  ) {}

  onStatusChange(status: 'Accepted' | 'Rejected') {
    this.statusChanged.emit({
      id: this.offer.offerId!,
      status
    });
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}