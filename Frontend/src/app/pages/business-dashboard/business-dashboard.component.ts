import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardsComponent } from '../../features/business-dashboard/components/stats-cards/stats-cards.component';
import { OverviewTabComponent } from "../../features/business-dashboard/components/overview-tab/overview-tab.component";
import { ProjectsTabComponent } from "../../features/business-dashboard/components/projects-tab/projects-tab.component";
import { MessagesTabComponent } from "../../features/business-dashboard/components/messages-tab/messages-tab.component";
import { NotificationsTabComponent } from "../../features/business-dashboard/components/notifications-tab/notifications-tab.component";
import { CalenderTabComponent } from "../../features/business-dashboard/components/calender-tab/calender-tab.component";
import { DailyFundingChartComponent } from '../../features/business-dashboard/components/daily-funding-chart/daily-funding-chart.component';
import { DemographicCardComponent } from "../../features/business-dashboard/components/demographic-card/demographic-card.component";
import { PerformanceChartComponent } from "../../features/business-dashboard/components/performance-chart/performance-chart.component";

@Component({
  selector: 'app-business-dashboard',
  imports: [CommonModule, StatsCardsComponent, OverviewTabComponent, ProjectsTabComponent, MessagesTabComponent, NotificationsTabComponent, CalenderTabComponent, DailyFundingChartComponent, DemographicCardComponent, PerformanceChartComponent],
  templateUrl: './business-dashboard.component.html',
  styleUrls: ['./business-dashboard.component.css'],
})
export class BusinessDashboardComponent {
  businessName = 'Green City Ventures';
  businessId = 'BUS123456';
  activeTab = 0;

  tabs = [
    { label: 'Overview' },
    { label: 'Projects' },
    { label: 'Messages' },
    { label: 'Notifications' },
    { label: 'Calendar' }
  ];

}