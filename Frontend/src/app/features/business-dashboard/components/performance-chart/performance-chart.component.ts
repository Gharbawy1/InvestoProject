import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-performance-chart',
  imports: [ CommonModule ],
  templateUrl: './performance-chart.component.html',
  styleUrls: ['./performance-chart.component.css']
})
export class PerformanceChartComponent {
  // Project timeline start date (current date).
  startDate = new Date();
  // Project deadline set to 30 days from the current date.
  deadline = new Date(new Date().setDate(new Date().getDate() + 30));
  // Funding goal amount in dollars.
  fundingGoal = 8000;
  // Current funding received in dollars.
  currentFunding = 3000;
  
  // Calculated performance metrics:
  daysRemaining = 0;           // Number of days remaining until the deadline.
  timelineProgress = 0;        // Percentage of the timeline that has been completed.
  fundingProgress = 0;         // Funding progress as a percentage of the funding goal.
  dailyTarget = 0;             // Ideal daily funding target to meet the funding goal.
  dailyTargetAchieved = 0;     // Percentage of the daily target achieved so far.
  daysCompleted = 0;           // Number of days that have passed since the start.
  dailyTargetMiss = 0;         // Amount by which the current funding falls short of the ideal funding.
  projectedCompletion = 0;     // Projected number of days to reach the funding goal based on current pace.

  /**
   * abs
   * Helper method to return the absolute value of a number.
   * @param value - The number to convert.
   * @returns The absolute value.
   */
  abs(value: number): number {
    return Math.abs(value);
  }

  /**
   * ngOnInit
   * Angular lifecycle hook that initializes the component.
   * It calls calculateMetrics to compute the performance metrics.
   */
  ngOnInit() {
    this.calculateMetrics();
  }

  /**
   * calculateMetrics
   * Calculates all performance metrics for the project.
   * - Determines the total number of days in the project timeline.
   * - Computes days remaining and days completed.
   * - Calculates timeline progress and funding progress percentages.
   * - Determines the ideal daily funding target.
   * - Calculates how much the current funding is missing to reach the ideal funding.
   * - Computes the percentage of the daily target achieved.
   * - Estimates projected completion days based on current funding pace.
   */
  private calculateMetrics() {
    // Calculate total days in the project timeline.
    const totalDays = Math.ceil((this.deadline.getTime() - this.startDate.getTime()) / (1000 * 3600 * 24));
    
    // Calculate days remaining until the deadline.
    this.daysRemaining = Math.max(0, Math.ceil((this.deadline.getTime() - Date.now()) / (1000 * 3600 * 24)));
    // Days completed is totalDays minus daysRemaining.
    this.daysCompleted = totalDays - this.daysRemaining;
    
    // Calculate timeline progress as the percentage of days completed.
    this.timelineProgress = Math.round(((totalDays - this.daysRemaining) / totalDays) * 100);
    // Calculate funding progress as the percentage of the funding goal achieved.
    this.fundingProgress = Math.round((this.currentFunding / this.fundingGoal) * 100);
    
    // Calculate the ideal daily funding target.
    this.dailyTarget = Math.round(this.fundingGoal / totalDays);
    // Ideal funding up to the current day.
    const idealFunding = this.dailyTarget * this.daysCompleted;
    // Calculate how much funding is missing compared to the ideal funding.
    this.dailyTargetMiss = Math.max(0, idealFunding - this.currentFunding);
    
    // Calculate the percentage of the daily target achieved.
    this.dailyTargetAchieved = Math.round((this.currentFunding / idealFunding) * 100);
    // Estimate the number of days required to reach the funding goal based on current pace.
    // Calculation avoids division by zero by assuming daysCompleted > 0.
    this.projectedCompletion = Math.abs(
      Math.round((this.fundingGoal - this.currentFunding) / (this.currentFunding / this.daysCompleted))
    );
  }
}