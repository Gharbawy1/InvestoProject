import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MatIconModule } from '@angular/material/icon';
import { MatCardSubtitle, MatCardModule } from '@angular/material/card';
import { Iinvestment } from '../../features/investor-dashboard/interfaces/iinvestment';
import { DashboardCardComponent } from '../../features/investor-dashboard/components/dashboard-card/dashboard-card.component';
import { DashboardTabComponent } from '../../features/investor-dashboard/components/dashboard-tab/dashboard-tab.component';
import { ListItemComponent } from '../../features/investor-dashboard/components/list-item/list-item.component';
import { ButtonComponent } from '../../shared/componentes/button/button.component';
import { OffersComponent } from '../../features/investor-dashboard/components/offers/offers.component';
import { OfferService } from '../../features/investor-dashboard/services/offers/offer.service';
import { IOfferProfile } from '../../features/project/interfaces/IOfferProfile';
import { AuthService } from '../../core/services/auth/auth.service';
import { InvestmentsComponent } from '../../features/investor-dashboard/components/investments/investments.component';
import { IRecommended } from '../../features/investor-dashboard/interfaces/recommended';
import { forkJoin, map } from 'rxjs';
import { RecommendedComponent } from '../../features/investor-dashboard/components/recommended/recommended.component';

@Component({
  selector: 'investor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatCardModule,
    MatCardSubtitle,
    DashboardCardComponent,
    DashboardTabComponent,
    MatCardSubtitle,
    ButtonComponent,
    ButtonComponent,
    OffersComponent,
    InvestmentsComponent,
    RecommendedComponent,
  ],
  templateUrl: './investor-dashboard.component.html',
  styleUrls: ['./investor-dashboard.component.css'],
})
export class InvestorDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private offersService = inject(OfferService);
  totalInvested = 0;
  activeInvestments = 5;
  portfolioGrowth = 12.4;

  investments: IOfferProfile[] = [];
  offers: IOfferProfile[] = [];
  recommended: IRecommended[] = [];
  categories: number[] = [];

  ngOnInit(): void {
    const investorId = this.authService.getUserId();

    // get all offers
    this.offersService.getOffersForCurrentUser().subscribe({
      next: (data) => {
        this.offers = data.data;

        // After fetching offers, process categories
        this.getCategories();
      },
      error: (err) => console.error('Error fetching offers:', err),
    });

    // get accepted offers
    this.offersService.getAcceptedOffers(investorId ?? '').subscribe({
      next: (data) => {
        console.log(data.data);
        debugger;
        data.data.forEach((offer) => {
          if (offer.isPaid) {
            this.investments = [...this.investments, offer];
          }
        });
        this.totalInvested = this.sumOfAmounts();
        this.activeInvestments = this.investments.length;
      },
      error: (err) => console.error('Error fetching investments:', err),
    });
  }

  getCategories() {
    // Use a Set to ensure no duplicate categories
    const uniqueCategories = new Set<number>();

    this.offers.forEach((offer) => {
      if (offer.status === 'Accepted') {
        uniqueCategories.add(offer.categoryId);
      }
    });

    // Fetch recommended projects based on unique categories
    const categoryRequests = Array.from(uniqueCategories).map((categoryId) =>
      this.offersService.getProjectByCategory(categoryId).pipe(
        map((data) => data.data) // Extract data directly from response
      )
    );

    // Combine all category requests
    forkJoin(categoryRequests).subscribe({
      next: (responses) => {
        this.recommended = responses
          .flat()
          .filter((project) => project.status === 'Accepted');
      },
      error: (err) =>
        console.error('Error fetching recommended projects:', err),
    });
  }

  sumOfAmounts() {
    return this.investments.reduce(
      (total, investment) => total + investment.offerAmount,
      0
    );
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
