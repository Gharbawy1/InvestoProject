import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

// Interface defining the structure of a milestone.
export interface Milestone {
  title: string;
  date: Date;
  status: 'completed' | 'in-progress' | 'Pending';
  description: string;
  daysRemaining: number;
  actionTooltip?: string;
}

@Component({
  selector: 'app-project-management',
  imports: [ CommonModule, MatTooltipModule ],
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.css']
})
export class ProjectManagementComponent implements OnInit {
  // Array to hold simulated milestone data. In production, this could be fetched via an API.
  milestones: Milestone[] = [];
  // Current active stage based on milestone status (typically the one in progress).
  currentStage: Milestone | null = null;

  // Additional properties for displaying project details.
  projectName: string = 'Green City Ventures - New Investment Initiative';
  // Project deadline set to 30 days from the current date.
  projectDeadline: Date = new Date(new Date().setDate(new Date().getDate() + 30));

  constructor() { }

  /**
   * ngOnInit
   * Lifecycle hook that initializes the component.
   * It sets up sample milestones and determines the current stage.
   */
  ngOnInit(): void {
    // Initialize milestones with sample data. Replace with API data as needed.
    this.milestones = [
      { 
        title: 'Project Overview', 
        date: new Date('2024-02-01'),
        status: 'completed',
        description: 'Initial project setup and basic information submission.',
        daysRemaining: 0,
        actionTooltip: 'View submission details'
      },
      { 
        title: 'Community Review', 
        date: new Date('2024-02-15'),
        status: 'in-progress',
        description: 'Investor feedback and Q&A period.',
        // Calculate the days remaining from today to the milestone date.
        daysRemaining: this.calculateDaysRemaining(new Date('2024-02-15')),
        actionTooltip: 'Respond to investor questions'
      },
      { 
        title: 'Launch Preparation', 
        date: new Date('2024-03-01'),
        status: 'Pending',
        description: 'Final approvals and documentation completion.',
        // Calculate days remaining for this Pending milestone.
        daysRemaining: this.calculateDaysRemaining(new Date('2024-03-01')),
        actionTooltip: 'Prepare launch materials'
      }
    ];

    // Set the current stage as the milestone marked "in-progress", if available.
    this.currentStage = this.milestones.find(m => m.status === 'in-progress') || null;
  }

  /**
   * calculateDaysRemaining
   * Calculates the number of days remaining from today to the given target date.
   * @param targetDate - The milestone date to compare against today's date.
   * @returns The number of days remaining; returns 0 if the date has passed.
   */
  calculateDaysRemaining(targetDate: Date): number {
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    return diffTime > 0 ? Math.ceil(diffTime / (1000 * 3600 * 24)) : 0;
  }

  /**
   * handleStageAction
   * Handler for the milestone action button click.
   * Executes custom logic based on the milestone, such as navigating to details or opening a modal.
   * @param milestone - The milestone for which the action is triggered.
   */
  handleStageAction(milestone: Milestone): void {
    console.log(`Action triggered for milestone: ${milestone.title}`);
    // Implement further logic here, e.g., navigation or modal display.
  }
}