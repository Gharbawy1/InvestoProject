import { Component, Input, OnInit } from '@angular/core';
import { DashboardBusiness } from '../../interfaces/IDashboardBusiness';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-overview',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  @Input() project: DashboardBusiness | null = null;

  constructor() { }

  ngOnInit() {
  }

  getFundingPercentage(): number {
    if (!this.project) return 0;
    
    if (this.project.fundingGoal <= 0) return 0;
    
    const percentage = (this.project.raisedFund / this.project.fundingGoal) * 100;
    return Math.min(percentage, 100);
  }

}
