import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IBusinessProfile } from '../../interfaces/IBusinessProfile';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-project-details-dialog',
  imports: [ MatIconModule, CommonModule ],
  templateUrl: './project-details-dialog.component.html',
  styleUrl: './project-details-dialog.component.css'
})
export class ProjectDetailsDialogComponent {
  @Output() statusChanged = new EventEmitter<{id: number, status: 'Accepted' | 'Rejected'}>();

  constructor(
    public dialogRef: MatDialogRef<ProjectDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public project: IBusinessProfile
  ) {}

  onStatusChange(status: 'Accepted' | 'Rejected') {
    this.statusChanged.emit({ id: this.project.id!, status });
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', 
      currency: 'USD'
    }).format(amount);
  }
}