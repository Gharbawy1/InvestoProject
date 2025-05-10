import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardsComponent } from '../../features/business-dashboard/components/stats-cards/stats-cards.component';
import { DocumentCenterComponent } from '../../features/business-dashboard/components/document-center/document-center.component';
import { OffersComponent } from '../../features/business-dashboard/components/offers/offers.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessForCurrentService } from '../../features/business-dashboard/services/business-for-current.service';
import { DashboardBusiness } from '../../features/business-dashboard/interfaces/IDashboardBusiness';
import { OverviewComponent } from '../../features/business-dashboard/components/overview/overview.component';
import { ManageComponent } from '../../features/business-dashboard/components/manage/manage.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-business-dashboard',
  imports: [
    CommonModule,
    MatIconModule,
    OverviewComponent,
    StatsCardsComponent,
    DocumentCenterComponent,
    OffersComponent,
    ManageComponent,
  ],
  templateUrl: './business-dashboard.component.html',
  styleUrls: ['./business-dashboard.component.css'],
})
export class BusinessDashboardComponent implements OnInit {
  // --- state ---
  activeProject: DashboardBusiness | null = null;
  canCreateProject = false;

  // UI state
  notificationCount = 3;
  activeSection = 'overview';

  sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'stats', label: 'Statistics' },
    { id: 'offers', label: 'Offers' },
    { id: 'documents', label: 'Documents' },
    { id: 'manage', label: 'Manage' },
  ];

  constructor(
    private BusinessForCurrentService: BusinessForCurrentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.loadProjects();
    });
  }

  loadProjects() {
    this.BusinessForCurrentService.getProjectsForCurrentUser()
      .subscribe({
        next: resp => {
          const data = resp.data;
          if (data) {
            if (data.id !== undefined && data.id !== null) {
              localStorage.setItem('projectId', data.id.toString());
            }
            this.activeProject = data;
            this.canCreateProject = false;
          } else {
            this.activeProject = null;
            this.canCreateProject = true;
          }
        },
        error: err => {
          console.error('Failed to load projects', err);
          this.activeProject = null;
          this.canCreateProject = true;
        }
      });
  }

  onNewProject(): void {
    if (!this.canCreateProject) {
      return alert('You’ve already created your one allowed project.');
    }
    this.router.navigate(['BusinessCreation']);
  }

  handleProjectDeleted(_deletedId: number) {
    this.activeProject = null;
    this.canCreateProject = true;
  
    this.loadProjects();  
  }
}
