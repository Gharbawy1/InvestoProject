import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MatIconModule } from '@angular/material/icon';
import { MatCardSubtitle, MatCardModule } from '@angular/material/card';
import { InvestmentService } from '../../features/investor-dashboard/services/investment/investment-service.service';
import { WatchlistService } from '../../features/investor-dashboard/services/watchlist/watchlist.service';
import { OpportunitiesService } from '../../features/investor-dashboard/services/opportunities/opportunities.service';
import { Iinvestment } from '../../features/investor-dashboard/interfaces/iinvestment';
import { DashboardCardComponent } from '../../features/investor-dashboard/components/dashboard-card/dashboard-card.component';
import { DashboardTabComponent } from '../../features/investor-dashboard/components/dashboard-tab/dashboard-tab.component';
import { ListItemComponent } from '../../features/investor-dashboard/components/list-item/list-item.component';
import { ButtonComponent } from '../../shared/componentes/button/button.component';

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
  ],
  templateUrl: './investor-dashboard.component.html',
  styleUrls: ['./investor-dashboard.component.css'],
})
export class InvestorDashboardComponent implements OnInit {
  private investmentService = inject(InvestmentService);
  private watchlistService = inject(WatchlistService);
  private opportunitiesService = inject(OpportunitiesService);

  userName = 'John Doe';
  totalInvested = 125000;
  activeInvestments = 5;
  portfolioGrowth = 12.4;

  investments: Iinvestment[] = [];
  wishlist: Iinvestment[] = [];
  opportunities: Iinvestment[] = [];

  ngOnInit(): void {
    const investorId = '1';

    this.investmentService.getInvestmentsByInvestorId(investorId).subscribe({
      next: (data) => (this.investments = data),
      error: (err) => console.error('Error fetching investments:', err),
    });

    this.watchlistService.getWatchlistByInvestorId(investorId).subscribe({
      next: (data) => (this.wishlist = data),
      error: (err) => console.error('Error fetching watchlist:', err),
    });

    this.opportunitiesService.getAvailableOpportunities().subscribe({
      next: (data) => (this.opportunities = data),
      error: (err) => console.error('Error fetching opportunities:', err),
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
