import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-investment-sidebar',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './investment-sidebar.component.html',
  styleUrls: ['./investment-sidebar.component.css'],
})
export class InvestmentSidebarComponent implements OnDestroy {
  @Input() fundingGoal = 0;
  @Input() raisedFunds = 0;
  @Input() numOfInvestors = 0;

  @Output() discussionClicked = new EventEmitter<void>();

  private readonly MIN_INVESTMENT = 1;
  private readonly PLATFORM_FEE_RATE = 0.05;
  private readonly PROCESSING_FEE_RATE = 0.03;
  private readonly PROCESSING_FLAT_FEE = 0.2;

  investmentAmount = this.MIN_INVESTMENT;
  isLoading = false;
  isLoggedIn = false;
  isInvestor = false;
  private userSub: Subscription = Subscription.EMPTY;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    const user = this.authService.getCurrentUser();
    this.isLoggedIn = !!user;
    this.isInvestor = user?.role.toLowerCase() === 'investor';
  }

  get status(): string {
    return this.raisedFunds >= this.fundingGoal ? 'funded' : 'active';
  }

  get progressPercentage(): number {
    if (!this.fundingGoal || this.fundingGoal <= 0) return 0;
    const percentage = (this.raisedFunds / this.fundingGoal) * 100;
    return Math.min(100, Math.round(percentage * 10) / 10);
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
      this.isInvestor &&
      !this.isLoading &&
      this.investmentAmount >= this.MIN_INVESTMENT &&
      this.status === 'active'
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
        .navigate(['offer'], { relativeTo: this.route })
        .then(() => (this.isLoading = false))
        .catch(() => (this.isLoading = false));
    }
  }

  onContact() {
    this.router.navigate(['discussion'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
