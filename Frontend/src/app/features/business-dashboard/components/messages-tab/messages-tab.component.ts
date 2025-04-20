import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface defining the structure of a Message.
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
  // Array of messages to be displayed in the messages tab.
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

  /**
   * getInitials
   * Extracts the first two initials from a given name.
   * @param name - The full name of the sender.
   * @returns A string containing up to two initials.
   */
  getInitials(name: string): string {
    // Split the name by spaces, take the first letter of each part,
    // join them together, and then return the first two characters.
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  }

  /**
   * formatDate
   * Formats a date string into a more readable format.
   * @param dateString - The date string to format.
   * @returns A formatted date string (e.g., "Dec 5, 02:30 PM").
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    // Use Intl.DateTimeFormat to format the date.
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}