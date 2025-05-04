import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectApprovalCardComponent } from '../../features/admin-dashboard/components/project-approval-card/project-approval-card.component';
import { MatIconModule } from '@angular/material/icon';
import { IBusinessProfile } from '../../features/admin-dashboard/interfaces/IBusinessProfile';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    ProjectApprovalCardComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  tabs = ['projects', 'users', 'settings'] as const;
  activeTab = signal<'projects' | 'users' | 'settings'>('projects');

  setActiveTab(tab: 'projects' | 'users' | 'settings') {
    this.activeTab.set(tab);
  }

}
