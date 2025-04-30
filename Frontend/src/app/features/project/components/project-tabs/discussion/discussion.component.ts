import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from "../../../../../shared/componentes/button/button.component";
import { IComment } from '../../../interfaces/IComment';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-discussion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    ButtonComponent
],
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css']
})
export class DiscussionComponent {
  @Input() comments: IComment[] = [
    
  ];

  @Output() commentSubmitted = new EventEmitter<string>();
  newComment = '';

  handleCommentSubmit(event: Event) {
    event.preventDefault();
    if (this.newComment.trim()) {
      this.commentSubmitted.emit(this.newComment);
      this.newComment = '';
    }
  }
  addComment(comment: string): void {
    const newComment: IComment = {
      user: '',
      avatar: '',
      content: comment,
      date: new Date(),
    };
    this.comments.unshift(newComment);
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