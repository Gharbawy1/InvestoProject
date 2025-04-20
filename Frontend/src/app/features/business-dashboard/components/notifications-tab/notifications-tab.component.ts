import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface representing a notification.
export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

@Component({
  selector: 'app-notifications-tab',
  imports: [ CommonModule ],
  templateUrl: './notifications-tab.component.html',
  styleUrls: ['./notifications-tab.component.css']
})
export class NotificationsTabComponent {
  // Constructor is currently empty, but available for dependency injection if needed.
  constructor() { }

  // Sample notifications data; in production, this data could be fetched from an API.
  notifications: Notification[] = [
    {
      id: '1',
      title: 'New Investment',
      message: 'You received a new investment of $10,000 for Eco-Friendly Urban Farm Initiative',
      time: '2 hours ago',
      unread: false
    },
    {
      id: '2',
      title: 'Document Request',
      message: 'Please upload the updated business plan for your Community Garden Expansion project',
      time: '1 day ago',
      unread: true
    },
  ];
}
