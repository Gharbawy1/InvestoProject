import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BusinessApprovalService } from '../../services/business-approval.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IBusinessProfile } from '../../interfaces/IBusinessProfile';
import { ProjectDetailsDialogComponent } from '../project-details-dialog/project-details-dialog.component';

@Component({
  selector: 'app-project-approval-card',
  imports: [CommonModule, FormsModule, MatIconModule, ProjectDetailsDialogComponent],
  templateUrl: './project-approval-card.component.html',
  styleUrls: ['./project-approval-card.component.css'],
})
export class ProjectApprovalCardComponent implements OnInit {
  @ViewChild('detailsModal') detailsModal!: TemplateRef<any>;

  private svc = inject(BusinessApprovalService);

  private dialogRef?: MatDialogRef<any>;

  selectedProject?: IBusinessProfile;
  
  constructor(private dialog: MatDialog) {}

  /** What we render */
  projects: IBusinessProfile[] = [];

  /** UI state */
  filterStatus: 'Pending' | 'Accepted' | 'Rejected' = 'Pending';
  isLoading  = false;
  error: string | null = null;
  noResults = false;

  ngOnInit() {
    this.onFilterChange();
  }

  /** Reset between requests */
  private resetState() {
    this.error = null;
    this.noResults = false;
    this.projects = [];
    this.isLoading = true;
  }

  /** Called when filter dropdown changes */
  onFilterChange() {
    this.resetState();
    this.svc.getbyStatus(this.filterStatus).subscribe({
      next: data => this.handleResponse(data),
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.noResults = true;
        } else {
          this.handleError(`load ${this.filterStatus.toLowerCase()} projects`);
        }
      }
    });
  }

  /** Shared response handler */
  private handleResponse(data: IBusinessProfile[]) {
    this.isLoading = false;
    if (data.length === 0) {
      this.noResults = true;
    } else {
      this.projects = data.map(p => ({ ...p, isExpanded: false }));
    }
  }

  private handleError(context: string) {
    this.isLoading = false;
    this.error = `Failed to ${context}.`;
  }

  /** Optimistic status update + rollback */
  handleStatusChange(id: number, newStatus: 'Accepted' | 'Rejected') {
    const old = this.projects.find(p => p.id === id)?.status;

    // 1) Optimistically update UI
    this.projects = this.projects.map(p =>
      p.id === id ? { ...p, status: newStatus } : p
    );

    // 2) Send to server
    this.svc.updateStatus(id, newStatus).subscribe({
      next: () => {
        this.onFilterChange();
      },
      error: () => {
        this.error = 'Status update failed; reverting.';
        if (old) {
          this.projects = this.projects.map(p =>
            p.id === id ? { ...p, status: old } : p
          );
        }
      }
    });
  }

  /** Format money */
  formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD'
    }).format(amount);
  }

  /** Badge colors */
  getBadge(status?: string) {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100   text-red-800';
      case 'Pending':  return 'bg-yellow-100 text-yellow-800';
      default:         return 'bg-gray-100  text-gray-800';
    }
  }

  reload() {
    this.onFilterChange();
  }

  openDetailsModal(project: IBusinessProfile) {
    const dialogRef = this.dialog.open(ProjectDetailsDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: project
    });
    dialogRef.componentInstance.statusChanged.subscribe(({id, status}) => {
      this.handleStatusChange(id, status);
    });
  }
}