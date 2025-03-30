import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardsComponent } from '../../features/business-dashboard/components/stats-cards/stats-cards.component';
import { OverviewTabComponent } from '../../features/business-dashboard/components/overview-tab/overview-tab.component';
import { ProjectsTabComponent } from '../../features/business-dashboard/components/projects-tab/projects-tab.component';
import { MessagesTabComponent } from '../../features/business-dashboard/components/messages-tab/messages-tab.component';
import { NotificationsTabComponent } from '../../features/business-dashboard/components/notifications-tab/notifications-tab.component';
import { CalendarTabComponent } from '../../features/business-dashboard/components/calendar-tab/calendar-tab.component';
import { DailyFundingChartComponent } from '../../features/business-dashboard/components/daily-funding-chart/daily-funding-chart.component';
import { DemographicCardComponent } from '../../features/business-dashboard/components/demographic-card/demographic-card.component';
import { PerformanceChartComponent } from '../../features/business-dashboard/components/performance-chart/performance-chart.component';
import { ProjectManagementComponent } from '../../features/business-dashboard/components/project-management/project-management.component';
import { DocumentCenterComponent } from '../../features/business-dashboard/components/document-center/document-center.component';
import { CommunicationHubComponent } from '../../features/business-dashboard/components/communication-hub/communication-hub.component';

// Interface representing an active project
interface ActiveProject {
  name: string;
  status: 'Active' | 'Pending' | 'Closed';
  deadline: Date;
  businessName: string;
}

@Component({
  selector: 'app-business-dashboard',
  imports: [
    CommonModule,
    StatsCardsComponent,
    OverviewTabComponent,
    ProjectsTabComponent,
    MessagesTabComponent,
    NotificationsTabComponent,
    CalendarTabComponent,
    DailyFundingChartComponent,
    DemographicCardComponent,
    PerformanceChartComponent,
    ProjectManagementComponent,
    DocumentCenterComponent,
    CommunicationHubComponent,
  ],
  templateUrl: './business-dashboard.component.html',
  styleUrls: ['./business-dashboard.component.css'],
})
export class BusinessDashboardComponent implements OnInit {
  // Business & Dashboard Details
  businessName = 'Green City Ventures';
  businessId = 'BUS123456';
  activeTab = 0; // Keeps track of the currently active tab (Overview, Projects, etc.)
  userInitials: string = ''; // Stores user initials for the profile avatar
  isDropdownOpen = false; // Controls the visibility of the profile dropdown
  hasNotifications = true; // Flag to indicate if there are any notifications
  notificationCount: number = 3; // Number of notifications to display

  /**
   * setUserInitials
   * Sets the user's initials based on their full name.
   * @param fullName - The full name of the user.
   */
  setUserInitials(fullName: string): void {
    if (fullName) {
      const nameParts = fullName.split(' ');
      // If the name has multiple parts, take the first letter of the first two parts
      this.userInitials =
        nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
          : nameParts[0][0].toUpperCase();
    }
  }

  /**
   * toggleDropdown
   * Toggles the profile dropdown menu.
   */
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Tabs for navigation, contributed by Bob Johnson
  tabs = [
    { label: 'Overview' },
    { label: 'Projects' },
    { label: 'Messages' },
    { label: 'Notifications' },
    { label: 'Calendar' }
  ];

  // Project creation properties
  lastProjectCreatedDate: Date | null = null; // Date of the last created project; null if none exists.
  nextProjectAvailableDate: Date = new Date(); // Date when the next project can be created.
  canCreateProject: boolean = true; // Flag to allow/disallow project creation

  // Active project details with business name included
  activeProject: ActiveProject = {
    name: `${this.businessName} - Eco-Friendly Urban Farm Initiative`,
    status: 'Active',
    // Deadline set to 30 days from the current date.
    deadline: new Date(new Date().setDate(new Date().getDate() + 30)),
    businessName: this.businessName
  };

  /**
   * ngOnInit
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Simulates initial data setup including user initials and project dates.
   */
  ngOnInit(): void {
    // Set user initials; replace 'Green City Ventures' with actual user name from authentication
    this.setUserInitials('Green City Ventures');
    // Simulate the last project creation date.
    this.lastProjectCreatedDate = new Date(); // For example, a project created today.
    if (this.lastProjectCreatedDate) {
      // Calculate the next available date for project creation: 1 month after the last project was created.
      this.nextProjectAvailableDate = new Date(this.lastProjectCreatedDate);
      this.nextProjectAvailableDate.setMonth(this.nextProjectAvailableDate.getMonth() + 1);
    }
    // Check if the user is eligible to create a new project.
    this.checkProjectCreationEligibility();
  }

  /**
   * checkProjectCreationEligibility
   * Determines whether the current date allows for a new project to be created.
   */
  checkProjectCreationEligibility(): void {
    const currentDate = new Date();
    if (!this.lastProjectCreatedDate) {
      // If no project has been created yet, allow creation.
      this.canCreateProject = true;
    } else {
      // Allow creation if the current date is past the next available project date.
      this.canCreateProject = currentDate >= this.nextProjectAvailableDate;
    }
  }

  /**
   * onNewProject
   * Handler for the "New Project" button.
   * Navigates to the project creation page if eligible, otherwise alerts the user.
   */
  onNewProject(): void {
    // Re-check project creation eligibility.
    this.checkProjectCreationEligibility();
    if (this.canCreateProject) {
      console.log('Navigating to project creation...');
      // Example: Navigate to the project creation page.
      // this.router.navigate(['/project/create']);
    } else {
      // Inform the user when they can create a new project.
      const message = `You can create a new project after ${this.nextProjectAvailableDate.toLocaleDateString()}.`;
      console.warn(message);
      alert(message);
    }
  }
}