import { Component, inject, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BusinessApprovalService } from '../../services/business-approval.service';
import { IBusinessProfile } from '../../interfaces/IBusinessProfile';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-project-approval-card',
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './project-approval-card.component.html',
  styleUrls: ['./project-approval-card.component.css'],
})
export class ProjectApprovalCardComponent {
  private projectService = inject(BusinessApprovalService);

  @Input() projects: IBusinessProfile[] = [];
  error: string | null = null;

  handleStatusChange(
    projectId: string,
    newStatus: 'Approved' | 'Rejected' | 'Pending'
  ) {
    // Optimistically update UI
    this.projects = this.projects.map((project) =>
      project.id === projectId ? { ...project, status: newStatus } : project
    );

    this.projectService.updateProjectStatus(projectId, newStatus).subscribe({
      next: () => {
        // Status updated successfully, no need to do anything
        console.log('Status updated successfully');
      },
      error: (err) => {
        this.error = 'Failed to update project status. Please try again.';
      },
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  reloadPage() {
    window.location.reload();
  }
}
