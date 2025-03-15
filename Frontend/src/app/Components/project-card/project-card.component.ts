import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-card',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent {
  id = '1';
  title = 'Eco-Friendly Urban Farm Initiative';
  businessName = 'Green City Ventures';
  description = 'A sustainable urban farming project that aims to provide fresh produce to local communities while reducing carbon footprint.';
  fundingProgress = 125000;
  fundingGoal = 250000;
  categories = ['Agriculture', 'Sustainability', 'Urban Development'];
  thumbnailUrl = 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

  get progressPercentage(): number {
    return Math.min(Math.round((this.fundingProgress / this.fundingGoal) * 100), 100);
  }
}
