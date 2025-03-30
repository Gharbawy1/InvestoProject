import { Component, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interface for a chat conversation.
export interface Chat {
  id: number;
  name: string;
  online: boolean;
  unread: number;
  lastMessage: {
    text: string;
    time: Date;
    sender: 'me' | 'them';
  };
}

// Interface for an individual message within a chat.
export interface Message {
  text: string;
  time: Date;
  sender: 'me' | 'them';
  status?: 'sent' | 'delivered' | 'read';
}


@Component({
  selector: 'app-communication-hub',
  imports: [ CommonModule, FormsModule ],
  templateUrl: './communication-hub.component.html',
  styleUrls: ['./communication-hub.component.css']
})
export class CommunicationHubComponent implements AfterViewInit {
  // Reference to the messages container DOM element to allow auto-scrolling.
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  // Inject ChangeDetectorRef to trigger change detection after view updates.
  constructor(private cdRef: ChangeDetectorRef) {}

  // Business initials used in the header of the communication hub.
  businessInitials: string = 'GC';
  // Search query for filtering the chat list.
  searchQuery = '';
  // Holds the text input for a new message.
  newMessage = '';

  // List of chats available in the communication hub.
  chats: Chat[] = [
    {
      id: 1,
      name: 'Investor A',
      online: true,
      unread: 2,
      lastMessage: {
        text: 'Can you share the financial projections?',
        time: new Date(),
        sender: 'them'
      }
    },
    {
      id: 2,
      name: 'Investor B',
      online: false,
      unread: 0,
      lastMessage: {
        text: 'Thanks for the documents!',
        time: new Date(),
        sender: 'me'
      }
    }
  ];

  // The currently active chat, initially set to the first chat in the list.
  activeChat: Chat | null = this.chats[0];

  // List of messages in the currently active conversation.
  messages: Message[] = [
    {
      text: "Hi! I'm interested in your Solar Farm Expansion project",
      time: new Date('2024-03-15T10:00'),
      sender: 'them',
    },
    {
      text: 'Great! What would you like to know?',
      time: new Date('2024-03-15T10:05'),
      sender: 'me',
      status: 'delivered'
    }
  ];

  // After the view initializes, scroll to the bottom of the messages container.
  ngAfterViewInit() {
    this.scrollToBottom();
  }

  // Filter chats based on the search query (case-insensitive).
  get filteredChats(): Chat[] {
    return this.chats.filter(chat => 
      chat.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  /**
   * selectChat
   * Sets the selected chat as active, resets its unread counter, and scrolls to the bottom.
   * @param chat - The chat selected from the list.
   */
  selectChat(chat: Chat): void {
    this.activeChat = chat;
    chat.unread = 0;
    // In a real app, you might load the full chat history here.
    this.scrollToBottom();
  }

  /**
   * sendMessage
   * Sends a new message if the input is not empty and an active chat exists.
   * It updates the chat's last message and simulates message status updates.
   */
  sendMessage(): void {
    if (this.newMessage.trim() && this.activeChat) {
      const newMsg: Message = {
        text: this.newMessage,
        time: new Date(),
        sender: 'me',
        status: 'sent'
      };
      
      // Add the new message to the messages array.
      this.messages.push(newMsg);
      // Update the active chat's last message.
      this.activeChat.lastMessage = {
        text: this.newMessage,
        time: new Date(),
        sender: 'me'
      };
      
      // Simulate message status change: first to 'delivered', then to 'read'.
      setTimeout(() => {
        newMsg.status = 'delivered';
        // Simulate further delay before marking the message as 'read'.
        setTimeout(() => newMsg.status = 'read', 1500);
      }, 1000);
      
      // Clear the message input field.
      this.newMessage = '';
      // Scroll to the bottom of the message list to show the latest message.
      this.scrollToBottom();
    }
  }

  /**
   * startNewConversation
   * Handler for initiating a new conversation. 
   * Currently, it logs a message; in a full app, it would open a new chat interface.
   */
  startNewConversation(): void {
    console.log('Starting new conversation');
  }

  /**
   * scrollToBottom
   * Scrolls the messages container to the bottom so that the latest messages are visible.
   * Uses a timeout to ensure that the view has updated before scrolling.
   */
  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
        // Trigger change detection to ensure UI updates.
        this.cdRef.detectChanges();
      }, 100);
    } catch (err) {
      // If scrolling fails, the error is silently caught.
    }
  }
}