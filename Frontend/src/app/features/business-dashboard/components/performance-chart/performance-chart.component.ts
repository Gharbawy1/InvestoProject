import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-performance-chart',
  imports: [ CommonModule ],
  templateUrl: './performance-chart.component.html',
  styleUrls: ['./performance-chart.component.css']
})
export class PerformanceChartComponent implements OnInit, AfterViewInit {
  startDate = new Date('2025-01-01');
  deadline = new Date('2025-06-01');
  daysRemaining!: number;
  timelineProgress!: number;

  fundingGoal = 150000;
  currentFunding = 125000;
  fundingProgress!: number;

  totalDays!: number;
  daysCompleted!: number;
  dailyTarget!: number;
  dailyTargetAchieved!: number;
  dailyTargetMiss!: number;

  milestonesCompleted = 3;
  totalMilestones = 5;
  projectCompletion!: number;

  ngOnInit(): void {
    const now = new Date();

    this.totalDays = Math.ceil((this.deadline.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24));
    this.daysRemaining = Math.max(0, Math.ceil((this.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    this.daysCompleted = Math.max(0, Math.min(this.totalDays, this.totalDays - this.daysRemaining));
    this.timelineProgress = Math.min(100, Math.round((this.daysCompleted / this.totalDays) * 100));

    this.fundingProgress = Math.min(100, Math.round((this.currentFunding / this.fundingGoal) * 100));

    this.dailyTarget = Math.round(this.fundingGoal / this.totalDays);
    const expectedSoFar = this.dailyTarget * this.daysCompleted;
    this.dailyTargetMiss = expectedSoFar - this.currentFunding;
    this.dailyTargetAchieved = Math.min(100, Math.round((expectedSoFar / this.fundingGoal) * 100));

    this.projectCompletion = Math.min(100, Math.round((this.milestonesCompleted / this.totalMilestones) * 100));
  }

  private chart: Chart<'line'> | null = null;

  ngAfterViewInit(): void {
    if (this.chart) this.chart.destroy();
    const ctx = document.getElementById('fundingTimelineChart') as HTMLCanvasElement;
    if (!ctx) return;

    const labels = Array.from({ length: this.totalDays + 1 }, (_, i) => i.toString());
    const idealLine = labels.map((_, i) => Math.round((i / this.totalDays) * this.fundingGoal));
    const actualLine = labels.map((_, i) =>
      i <= this.daysCompleted ? Math.round((i / this.daysCompleted) * this.currentFunding) : this.currentFunding
    );

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Ideal Funding',
            data: idealLine,
            borderDash: [5, 5],
            tension: 0.3,
            borderColor: '#60A5FA',
          },
          {
            label: 'Actual Funding',
            data: actualLine,
            fill: true,
            tension: 0.3,
            borderColor: '#34D399',
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: {
          x: { title: { display: true, text: 'Days Since Start' } },
          y: { title: { display: true, text: 'Amount ($)' } },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }

  ngOnDestroy(): void {
    if (this.chart) this.chart.destroy();
  }

  getAbs(value: number): number {
    return Math.abs(value);
  }
}