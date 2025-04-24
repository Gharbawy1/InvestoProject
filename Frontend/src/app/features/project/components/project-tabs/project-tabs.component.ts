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
import { IComment } from '../../interfaces/IComment';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-project-tabs',
  imports: [
    CommonModule,
    MarketAnalysisComponent,
    BusinessInfoComponent,
    TeamMembersComponent,
    FinancialsComponent,
    DocumentsComponent,
    UpdatesComponent,
    DiscussionComponent,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './project-tabs.component.html',
  styleUrl: './project-tabs.component.css',
})
export class ProjectTabsComponent {
  @Input() activeTab = 'overview';
  @Input() projectData: any;
  comments : IComment[] = [
    {
          user: 'John Doe',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          date: '2023-01-15T14:30:00',
          content: 'This is an interesting project!'
        },
        {
          user: 'ALex Smith',
          avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
          date: '2023-01-16T09:15:00',
          content: 'I have a question about the investment terms.'
        }
  ];
  showTab(tab: string) {
    this.activeTab = tab;
  }

  onCommentSubmitted(comment: string) {
    // Add to local comments array if needed
    this.comments.unshift({
      user: 'Current User',
      avatar: 'path/to/avatar.jpg',
      date: new Date().toISOString(),
      content: comment,
    });
  }
}
