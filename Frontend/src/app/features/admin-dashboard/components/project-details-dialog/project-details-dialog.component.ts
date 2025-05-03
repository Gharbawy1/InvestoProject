import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IBusinessProfile } from '../../interfaces/IBusinessProfile';

@Component({
  selector: 'app-project-details-dialog',
  imports: [],
  templateUrl: './project-details-dialog.component.html',
  styleUrl: './project-details-dialog.component.css'
})
export class ProjectDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ProjectDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { project: IBusinessProfile }
  ) {}

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  onApprove(): void {
    this.dialogRef.close('Approved');
  }

  onReject(): void {
    this.dialogRef.close('Rejected');
  }

  close(): void {
    this.dialogRef.close();
  }
}