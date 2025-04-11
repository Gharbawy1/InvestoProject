import { Component, Input } from '@angular/core';
import { MarketAnalysisComponent } from './market-analysis/market-analysis.component';
import { BusinessInfoComponent } from './business-info/business-info.component';
import { FinancialsComponent } from './financials/financials.component';
import { DocumentsComponent } from './documents/documents.component';
import { UpdatesComponent } from './updates/updates.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { TeamMembersComponent } from './team-members/team-members.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-project-tabs',
  imports: [
    MarketAnalysisComponent,
    BusinessInfoComponent,
    TeamMembersComponent,
    FinancialsComponent,
    DocumentsComponent,
    UpdatesComponent,
    DiscussionComponent,
    MatIconModule,
    MatTabsModule,
    CommonModule,
  ],
  templateUrl: './project-tabs.component.html',
  styleUrl: './project-tabs.component.css',
})
export class ProjectTabsComponent {
  @Input() activeTab = 'overview';
  @Input() projectData: any;

  showTab(tab: string) {
    this.activeTab = tab;
  }
}
