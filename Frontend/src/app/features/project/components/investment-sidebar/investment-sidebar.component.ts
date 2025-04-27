import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-investment-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
  ],
  templateUrl: './investment-sidebar.component.html',
  styleUrls: ['./investment-sidebar.component.css'],
})
export class InvestmentSidebarComponent {
  @Input() fundingGoal = 0;
  @Input() currentFunding = 0;
  @Input() status = 'pending';
  @Input() numOfInvestors = 0;

  @Output() discussionClicked = new EventEmitter<void>();

  private readonly MIN_INVESTMENT = 10000;
  private readonly PLATFORM_FEE_RATE = 0.05;
  private readonly PROCESSING_FEE_RATE = 0.03;
  private readonly PROCESSING_FLAT_FEE = 0.2;

  investmentAmount = this.MIN_INVESTMENT;
  isLoading = false;

  constructor(public router: Router, private route: ActivatedRoute) {}

  get progressPercentage(): number {
    if (!this.fundingGoal || this.fundingGoal <= 0) {
      return 0;
    }
    const pct = (this.currentFunding / this.fundingGoal) * 100;
    return Math.max(0, Math.min(100, Math.round(pct)));
  }

  setInvestmentAmount(amount: number): void {
    this.investmentAmount = amount;
  }

  calculateEquity(): string {
    return ((this.investmentAmount / this.fundingGoal) * 15).toFixed(1);
  }

  onInvestmentChange(): void {
    this.investmentAmount = Math.max(this.investmentAmount, 0);
  }

  get canInvest(): boolean {
    return (
      !this.isLoading &&
      this.investmentAmount >= this.MIN_INVESTMENT &&
      this.progressPercentage < 100
    );
  }

  /** Platform fee (5%) */
  calculatePlatformFee(): number {
    return this.investmentAmount * this.PLATFORM_FEE_RATE;
  }

  /** Payment processing fee (3% + flat) */
  calculateProcessingFee(): number {
    return (
      this.investmentAmount * this.PROCESSING_FEE_RATE +
      this.PROCESSING_FLAT_FEE
    );
  }

  /** Total fees (platform + processing) */
  calculateTotalFees(): number {
    return this.calculatePlatformFee() + this.calculateProcessingFee();
  }

  /** Net amount project receives after fees */
  calculateNetPayout(): number {
    return this.investmentAmount - this.calculateTotalFees();
  }

  /** Equity share placeholder (15% of fundingGoal) */
  calculateEquityShare(): string {
    return ((this.investmentAmount / this.fundingGoal) * 15).toFixed(1);
  }

  onInvest(): void {
    if (!this.canInvest) return;
    this.isLoading = true;
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      // navigate into the nested child
      this.router
        .navigate(['/Payment'])
        .then(() => (this.isLoading = false))
        .catch(() => (this.isLoading = false));
    }
  }

  onContact() {
    this.router.navigate(['discussion'], { relativeTo: this.route });
  }
}
