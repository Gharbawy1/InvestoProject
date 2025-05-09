import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProjectTabsComponent } from '../../features/project/components/project-tabs/project-tabs.component';
import { InvestmentSidebarComponent } from '../../features/project/components/investment-sidebar/investment-sidebar.component';
import { ProjectContextService } from '../../features/project/services/project-context/project-context.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { tap } from 'rxjs';
import { IBusinessDetails } from '../../features/project/interfaces/IBusinessDetails';
import { UserDetails } from '../../core/interfaces/UserDetails';
import { SafeEncoder } from '../../shared/utils/encoding';

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
  project?: IBusinessDetails;
  owner?: UserDetails;
  error?: string;
  errorMessage?: string;

  activeTab: string = 'overview';

  isProjectOwner = false;

  blockMessage = '';
  navigationPath: string[] = ['/'];
  navigationButtonText = 'Go home';

  constructor(
    private projectContext: ProjectContextService,
    public router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data
      .pipe(tap(() => console.log('Auth state:', this.authService.getUserId())))
      .subscribe({
        next: ({ projectData }) => {
          if (!projectData) return;
          this.project = projectData;
          this.owner = projectData.ownerName;
          this.isProjectOwner = this.authService.getUserId() === this.owner?.id;
          this.projectContext.setProject(projectData);
          if (this.status === 'Pending' || this.status === 'rejected') {
            if (this.isProjectOwner) {
              this.blockAccess({
                message:
                  'This project is under review or unavailable. Please check back later.',
                path: ['/BusinessDashboard'],
                buttonText: 'Go to Dashboard',
              });
            } else {
              this.blockAccess({
                message:
                  'This project is under review or unavailable. Please check back later.',
                path: ['/'],
                buttonText: 'Go Home',
              });
            }
          }
        },
        error: (err) => {
          this.error = err.message;
          this.router.navigate(['/error']);
        },
      });

    this.route.queryParamMap.subscribe((params) => {
      const tab = params.get('tab');
      if (tab) this.activeTab = tab;
    });
  }

  blockAccess(config: {
    message: string;
    path: string[];
    buttonText?: string;
  }) {
    this.blockMessage = config.message;
    this.navigationPath = config.path;
    this.navigationButtonText = config.buttonText || 'Go home';
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

  navigateToOwnerProfile() {
    try {
      const id = this.project?.ownerId;
      if (!id) {
        console.error('No owner ID available');
        this.errorMessage = 'Owner information not available';
        return;
      }

      const encodedId = SafeEncoder.encode(id);
      this.router.navigate(['/profile', encodedId]);
    } catch (error) {
      console.error('Navigation failed:', error);
      this.errorMessage = 'Could not navigate to profile. Please try again.';
      setTimeout(() => (this.errorMessage = undefined), 5000);
    }
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

  /** current funding */
  get raisedFunds(): number {
    return this.project?.raisedFund || 0;
  }

  /** Funding terms */
  get fundingExchange(): string {
    return this.project?.fundingExchange || '';
  }

  /** Project status */
  get status(): string {
    return this.project?.status.toLowerCase() || 'Pending';
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
    return this.project?.ownerName || '';
  }

  /** number of investor */
  get numOfInvestors(): number {
    return this.project?.investorsCount || 0;
  }

  openImageModal(imageUrl: string) {
    window.open(imageUrl, '_blank');
  }
}
