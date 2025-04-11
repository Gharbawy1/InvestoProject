import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-investment-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './investment-sidebar.component.html'
})
export class InvestmentSidebarComponent {
  @Input() fundingProgress = 0;
  @Input() fundingGoal = 0;
  @Input() progressPercentage = 0;
  
  investmentAmount = 1000;

  calculateEquity(): string {
    return ((this.investmentAmount / this.fundingGoal) * 15).toFixed(2);
  }

  calculateTotal(): string {
    return (this.investmentAmount * 1.02).toFixed(2);
  }
}