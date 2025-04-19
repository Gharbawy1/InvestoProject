import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-overview-tab',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './overview-tab.component.html',
  styleUrls: ['./overview-tab.component.css']
})
export class OverviewTabComponent {

  // Example projects data; replace with real data source as needed.
  projects = [
    {
      id: '1',
      title: 'Eco-Friendly Urban Farm Initiative',
      fundingProgress: 125000,
      fundingGoal: 250000,
      status: 'active',
      investors: 42,
      createdAt: '2023-10-01',
    },
    {
      id: '2',
      title: 'Community Garden Expansion',
      fundingProgress: 75000,
      fundingGoal: 75000,
      status: 'funded',
      investors: 28,
      createdAt: '2023-11-15',
    },
    {
      id: '3',
      title: 'Sustainable Water System',
      fundingProgress: 200000,
      fundingGoal: 200000,
      status: 'funded',
      investors: 56,
      createdAt: '2023-08-20',
    },
  ];

  // Example messages data for the overview tab.
  messages = [
    {
      id: '1',
      from: 'John Smith',
      subject: 'Investment Inquiry',
      preview: "I'm interested in learning more about your urban farm project...",
      date: '2023-12-05',
      unread: true,
    },
    {
      id: '2',
      from: 'Sarah Johnson',
      subject: 'Partnership Opportunity',
      preview: 'Our organization would like to discuss a potential partnership...',
      date: '2023-12-03',
      unread: false,
    },
  ];

  // Example notifications data for the overview tab.
  notifications = [
    {
      id: '1',
      title: 'New Investment',
      message: 'You received a new investment of $10,000 for Eco-Friendly Urban Farm Initiative',
      time: '2 hours ago',
    },
    {
      id: '2',
      title: 'Document Request',
      message: 'Please upload the updated business plan for your Community Garden Expansion project',
      time: '1 day ago',
    },
  ];

  constructor() { }
}