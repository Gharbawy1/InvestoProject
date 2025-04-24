import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Users, FileText, Settings } from 'lucide-angular';
import { ProjectApprovalCardComponent } from '../../features/admin-dashboard/components/project-approval-card/project-approval-card.component';


@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterModule, LucideAngularModule, ProjectApprovalCardComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  activeTab = signal<'projects' | 'users' | 'settings'>('projects');

  setActiveTab(tab: 'projects' | 'users' | 'settings') {
    this.activeTab.set(tab);
  }
}

