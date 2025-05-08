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
    ListItemComponent,
    ButtonComponent,
    OffersComponent,
    InvestmentsComponent,
  ],
  templateUrl: './investor-dashboard.component.html',
  styleUrls: ['./investor-dashboard.component.css'],
})
export class InvestorDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private offersService = inject(OfferService);
  userName = 'John Doe';
  totalInvested = 125000;
  activeInvestments = 5;
  portfolioGrowth = 12.4;

  investments: IOfferProfile[] = [];
  wishlist: Iinvestment[] = [];
  opportunities: Iinvestment[] = [];
  offers: IOfferProfile[] = [];

  ngOnInit(): void {
    const investorId = this.authService.getUserId();
    this.offersService.getOffersForCurrentUser().subscribe({
      next: (data) => (this.offers = data.data),
      error: (err) => console.error('Error fetching investments:', err),
    });
    this.offersService.getAcceptedOffers(investorId ?? '').subscribe({
      next: (data) => (this.investments = data.data),
      error: (err) => console.error('Error fetching investments:', err),
    });
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
