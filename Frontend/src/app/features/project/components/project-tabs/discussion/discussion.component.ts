import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { Comment } from '../../../interfaces/IComment';


@Component({
  selector: 'app-discussion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css']
})
export class DiscussionComponent {
  @Input() comments: Comment[] = [
    {
      user: "Jennifer Wu",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
      date: "2023-10-20",
      content: "I'm impressed by the comprehensive approach to sustainability. Have you considered integrating aquaponics into your system?"
    },
    {
      user: "Robert Taylor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      date: "2023-10-18",
      content: "As a restaurant owner, I'm excited about the potential for ultra-fresh produce. What's your planned delivery schedule going to look like?"
    },
    {
      user: "Aisha Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha",
      date: "2023-10-15",
      content: "The community education component of this project is what sets it apart. Looking forward to seeing how this develops!"
    }
  ];

  newComment: string = '';

  handleCommentSubmit(event: Event) {
    event.preventDefault();
    if (this.newComment.trim()) {
      // In a real app, this would submit to a backend
      const newCommentObj: Comment = {
        user: "Current User",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
        date: new Date().toISOString(),
        content: this.newComment
      };
      this.comments.unshift(newCommentObj);
      this.newComment = '';
    }
  }
}