import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatCard, MatCardContent, MatCardModule, MatCardSubtitle } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { DashboardTabComponent } from '../../features/investor-dashboard/components/dashboard-tab/dashboard-tab.component';
import { DashboardCardComponent } from '../../features/investor-dashboard/components/dashboard-card/dashboard-card.component';
import { ButtonComponent } from '../../shared/componentes/button/button.component';
import { Iinvestment } from '../../features/investor-dashboard/interfaces/iinvestment';
import { ListItemComponent } from "../../features/investor-dashboard/components/list-item/list-item.component";

@Component({
  selector: 'investor-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    DashboardCardComponent,
    DashboardTabComponent,
    MatCardSubtitle,
    ButtonComponent,
    ListItemComponent,
],
  templateUrl: './investor-dashboard.component.html',
  styleUrls: ['./investor-dashboard.component.css'],
})
export class InvestorDashboardComponent {
  userName = 'John Doe';
  totalInvested = 125000;
  activeInvestments = 5;
  portfolioGrowth = 12.4;
  opportunities : Iinvestment[] = [];
  wishlist : Iinvestment[] = [];
  investments: Iinvestment[] = [
    {
      id: 'inv-1',
      projectName: 'Green Energy Solutions',
      amount: 25000,
      date: '2023-05-15',
      status: 'active',
      progress: 75,
      returnRate: 8.5
    },
    {
      id: 'inv-2',
      projectName: 'Tech Startup Accelerator',
      amount: 15000,
      date: '2023-07-22',
      status: 'active',
      progress: 45,
      returnRate: 15.2
    },
    {
      id: 'inv-3',
      projectName: 'Real Estate Development',
      amount: 50000,
      date: '2023-03-10',
      status: 'active',
      progress: 90,
      returnRate: 7.8
    },
    {
      id: 'inv-4',
      projectName: 'Healthcare Innovation Fund',
      amount: 20000,
      date: '2023-08-05',
      status: 'pending',
      progress: 10,
      returnRate: 12.0
    },
    {
      id: 'inv-5',
      projectName: 'Sustainable Agriculture',
      amount: 15000,
      date: '2023-06-18',
      status: 'active',
      progress: 60,
      returnRate: 9.5
    }
  ];
  
  tabContents = {
    investments: this.investments,
    opportunities: [],
    watchlist: [],
  };

  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
