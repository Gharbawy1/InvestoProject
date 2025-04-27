import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-tabs',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './project-tabs.component.html',
  styleUrl: './project-tabs.component.css',
})
export class ProjectTabsComponent {
  @Input() activeTab!: string;
  @Input() projectData: any;
  @Output() tabChange = new EventEmitter<string>();

  constructor(private route: ActivatedRoute) {}

  tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'business-info', label: 'Business' },
    { id: 'financials', label: 'Financials' },
    { id: 'documents', label: 'Documents' },
    { id: 'updates', label: 'Updates' },
    { id: 'discussion', label: 'Discussion' },
  ];

  ngOnInit() {
    this.route.firstChild?.url.subscribe(url => {
      if (url.length) {
        this.activeTab = url[0].path;
      }
    });
  }
  
  comments : IComment[] = [
    {
      user: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      date: new Date('2023-01-15T14:30:00'),
      content: 'This is an interesting project!'
    },
    {
      user: 'ALex Smith',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      date: new Date('2023-01-16'),
      content: 'I have a question about the investment terms.'
    }
  ];

  addComment(comment: string): void {
    const newComment: IComment = {user: '', avatar: '', content: comment, date: new Date() }; 
    this.comments.unshift(newComment);
  }

  showTab(tab: string) {
    this.activeTab = tab;
  }

  onCommentSubmitted(comment: string) {
    // Add to local comments array if needed
    this.comments.unshift({
      user: 'Current User',
      avatar: 'path/to/avatar.jpg',
      date: new Date(),
      content: comment,
    });
  }
}
