import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OfferService } from '../../../services/offer/offer.service';
import { IOffer } from '../../../interfaces/ioffer';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { ProjectContextService } from '../../../services/project-context/project-context.service';
import { IBusinessDetails } from '../../../interfaces/IBusinessDetails';
import { filter, take, takeUntil, timeout } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Component({
  selector: 'app-offer',
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css'],
})
export class OfferComponent implements OnInit {
  offer: IOffer = {
    offerAmount: 0,
    investmentType: 'Equity',
    equityPercentage: 0,
    profitShare: 0,
    offerTerms: '',
    projectId: 0,
    investorId: '',
  };

  private destroy$ = new Subject<void>();

  isLoading = false;
  successMessage = '';
  errorMessage = '';
  investmentTypes = ['Equity', 'Debt', 'ProfitShare'];
  canSubmit: boolean = false;
  showForm = false;
  formSubmitted = false;
  blockMessage = '';
  navigationPath: string[] = ['/InvestorDashboard'];
  navigationButtonText = 'Go Back';
  fundingGoal = 0;
  raisedFund = 0;

  constructor(
    public router: Router,
    private authService: AuthService,
    private offerSvc: OfferService,
    private projectCtx: ProjectContextService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.blockAccess({
        message: 'You must be logged in as an Investor to submit offers.',
        path: ['/auth'],
        buttonText: 'Login Now',
      });
      return;
    }
    if (user.role !== 'Investor') {
      if (user.role === 'User') {
        this.blockAccess({
          message: 'You must upgrade to the Investor role to submit offers.',
          path: ['/UpgradeRole'],
          buttonText: 'Upgrade Now',
        });
        return;
      }
      this.blockAccess({
        message: 'Only users with the Investor role may submit offers.',
        path: ['/'],
        buttonText: 'Return to home',
      });
      return;
    }
    this.offer.investorId = user.id;

    this.projectCtx.project$
      .pipe(
        takeUntil(this.destroy$),
        filter((p): p is IBusinessDetails => !!p),
        take(1),
        timeout({
          first: 5000,
          with: () => throwError(() => new Error('Project load timeout')),
        })
      )
      .subscribe({
        next: (p) => {
          const projectIdNum = Number(p.id);
          this.fundingGoal = p.fundingGoal;
          this.raisedFund = p.raisedFund;
          if (isNaN(projectIdNum)) {
            this.errorMessage = 'Invalid project ID';
            return;
          }
          this.offer.projectId = projectIdNum;
          this.ensureSingleOffer(projectIdNum, user.id);
        },
        error: (err) => {
          this.errorMessage = err.message || 'No project selected.';
          this.canSubmit = false;
        },
      });
  }

  private blockAccess(config: {
    message: string;
    path: string[];
    buttonText?: string;
  }) {
    this.showForm = false;
    this.canSubmit = false;
    this.blockMessage = config.message;
    this.navigationPath = config.path;
    this.navigationButtonText = config.buttonText || 'Continue';
  }

  private ensureSingleOffer(projectId: number, investorId: string) {
    this.offerSvc
      .getCurrentUserOffers()
      .pipe(take(1))
      .subscribe({
        next: (offers) => {
          const hasExisting = offers.some(
            (o) => o.projectId === projectId && o.investorId === investorId
          );

          if (hasExisting) {
            this.blockAccess({
              message: 'You have already submitted an offer for this project.',
              path: ['/InvestorDashboard'],
              buttonText: 'View Dashboard',
            });
          } else {
            this.showForm = true;
            this.canSubmit = true;
          }
        },
        error: (err) => {
          console.error('Offer verification failed:', err);
          this.blockAccess({
            message:
              'Could not verify existing offers. Please try again later.',
            path: ['/InvestorDashboard'],
            buttonText: 'Try Again',
          });
          this.canSubmit = false;
        },
      });
  }

  submit() {
    this.formSubmitted = true;
    this.clearMessages();

    if (!this.offer.offerTerms || !this.offer.investmentType) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    if (!this.isValid()) {
      this.errorMessage = 'Please correct validation errors';
      return;
    }

    this.isLoading = true;
    this.offerSvc.createOffer(this.offer as IOffer).subscribe({
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err),
    });
  }

  private handleSuccess() {
    this.isLoading = false;
    this.successMessage =
      'Offer sent to bussiness owner successfully and waiting for approval!';
    alert(this.successMessage);
  }

  private handleError(error: any) {
    this.blockAccess({
      message:
        error.error?.message || 'Failed to submit offer. Please try again.',
      path: ['/InvestorDashboard'],
      buttonText: 'Try Again',
    });
  }

  private clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  isValid(): boolean {
    return (
      this.validateRequiredFields() &&
      this.validateAmount() &&
      this.validatePercentages()
    );
  }

  private validateAmount(): boolean {
    const amount = this.offer.offerAmount;
    const maxAmount = this.fundingGoal - this.raisedFund;
    return typeof amount === 'number' && amount > 0 && amount <= maxAmount;
  }

  private validateRequiredFields(): boolean {
    return (
      !!this.offer.offerAmount &&
      !!this.offer.investmentType &&
      !!this.offer.offerTerms &&
      !!this.offer.equityPercentage &&
      !!this.offer.profitShare
    );
  }

  private validatePercentages(): boolean {
    return [this.offer.equityPercentage, this.offer.profitShare].every(
      (pct) => (pct ?? 0) > 0 && (pct ?? 0) <= 100
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
