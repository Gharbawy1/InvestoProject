import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
}

@Component({
  selector: 'app-messages-tab',
  imports: [ CommonModule ],
  templateUrl: './messages-tab.component.html',
  styleUrls: ['./messages-tab.component.css']
})
export class MessagesTabComponent {

  constructor() { }

  messages: Message[] = [
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

}
