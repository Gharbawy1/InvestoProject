import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from "../../../../shared/componentes/button/button.component";
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-investment-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    ButtonComponent
],
  templateUrl: './investment-sidebar.component.html',
  styleUrls: ['./investment-sidebar.component.css']
})
export class InvestmentSidebarComponent {
  @Input() fundingProgress = 125000;
  @Input() fundingGoal = 250000;
  investmentAmount = 1000;

  get progressPercentage(): number {
    return Math.min(Math.round((this.fundingProgress / this.fundingGoal) * 100), 100);
  }

  setInvestmentAmount(amount: number) {
    this.investmentAmount = amount;
  }

  calculateEquity(): string {
    return ((this.investmentAmount / this.fundingGoal) * 15).toFixed(2);
  }

  calculateProcessingFee(): string {
    return (this.investmentAmount * 0.02).toFixed(2);
  }

  calculateTotal(): string {
    return (this.investmentAmount * 1.02).toFixed(2);
  }

  onInvestmentChange() {
    // Additional logic when investment amount changes
  }
}