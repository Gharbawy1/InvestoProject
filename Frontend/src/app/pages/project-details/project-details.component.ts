import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {
  BusinessDetailsService,
  Project,
  UserDetails,
} from '../../features/project/services/business-details/business-details.service';
import { ProjectTabsComponent } from '../../features/project/components/project-tabs/project-tabs.component';
import { InvestmentSidebarComponent } from '../../features/project/components/investment-sidebar/investment-sidebar.component';
import { BusinessCreationComponent } from '../business-creation/business-creation.component';
import { ProjectContextService } from '../../features/project/services/project-context.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { tap } from 'rxjs';

@Component({
  selector: 'app-project-details',
  imports: [
    CommonModule,
    RouterModule,
    InvestmentSidebarComponent,
    MatIconModule,
    MatProgressSpinnerModule,
    ProjectTabsComponent,
  ],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
})
export class ProjectDetailsComponent implements OnInit {
  project?: Project;
  owner?: UserDetails;
  isLoading = true;
  error?: string;

  activeTab: string = 'overview';

  isOwnerRejected = false;
  isProjectOwner = false;

  constructor(
    private businessDetailsService: BusinessDetailsService,
    private projectContext: ProjectContextService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data
      .pipe(tap(() => console.log('Auth state:', this.authService.getUserId())))
      .subscribe({
        next: ({ projectData }) => {
          if (!projectData) return;

          console.log('Received project data:', projectData);

          this.project = projectData.project;
          this.owner = projectData.owner;

          this.isProjectOwner = this.authService.getUserId() === this.owner?.id;
          this.isOwnerRejected =
            this.project?.status.toLowerCase() === 'rejected';

          console.log('Component Check:', {
            isProjectOwner: this.isProjectOwner,
            isOwnerRejected: this.isOwnerRejected,
          });

          if (this.isOwnerRejected && !this.isProjectOwner) {
            console.log('Redirecting non-owner from rejected project');
            this.router.navigate(['/']);
            return;
          }

          if (this.project) {
            this.projectContext.setProject(this.project);
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.message;
          this.isLoading = false;
          this.router.navigate(['/error']);
        },
      });

    this.route.queryParamMap.subscribe((params) => {
      const tab = params.get('tab');
      if (tab) this.activeTab = tab;
    });
  }

  // Add to component methods
  goToBusinessCreation() {
    this.router.navigate(['/business-creation']);
  }

  onTabSelected(tabId: string) {
    this.activeTab = tabId;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabId },
      queryParamsHandling: 'merge',
    });
  }

  // --- PROJECT FIELDS ---

  /** Project thumbnail URL */
  get projectImageUrl(): string {
    return this.project?.projectImageUrl || 'assets/image-not-found2.png';
  }

  /** Project title or placeholder */
  get title(): string {
    return this.project?.projectTitle || 'Project Title';
  }

  /** Project subtitle or placeholder */
  get subtitle(): string {
    return this.project?.subtitle || '';
  }

  /** Project location or placeholder */
  get location(): string {
    return this.project?.projectLocation || '';
  }

  /** Funding goal */
  get fundingGoal(): number {
    return this.project?.fundingGoal || 0;
  }

  /** Funding terms */
  get fundingExchange(): string {
    return this.project?.fundingExchange || '';
  }

  /** Project status */
  get status(): string {
    return this.project?.status.toLowerCase() || 'pending';
  }

  /** Vision */
  get projectVision(): string {
    return this.project?.projectVision || '';
  }

  /** Story */
  get projectStory(): string {
    return this.project?.projectStory || '';
  }

  /** Goals */
  get goals(): string {
    return this.project?.goals || '';
  }

  /** Category Name */
  get categoryName(): string {
    return this.project?.categoryName || '';
  }

  /** Owner Full Name */
  get ownerName(): string {
    return this.owner
      ? `${this.owner.firstName} ${this.owner.lastName}`
      : 'Unknown Owner';
  }

  /** Owner Avatar */
  get ownerProfileImage(): string {
    return this.owner?.profilePictureURL || 'assets/OIP.jpg';
  }

  /** current funding */
  get currentFunding(): number {
    return 5000;
  }

  /** number of investor */
  get numOfInvestors(): number {
    return 4;
  }

  /** project team */
  get projectTeam(): string[] {
    return ['John Doe', 'Jane Smith', 'Alice Johnson'];
  }

  /** market analysis */
  get marketAnalysis(): string {
    return 'Market analysis content goes here.';
  }
}
