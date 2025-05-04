import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { InvestmentService } from '../../services/investment/investment-service.service';
import { Iinvestment } from '../../interfaces/iinvestment';

@Component({
  selector: 'dashboard-tab',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatCardModule],
  templateUrl: './dashboard-tab.component.html',
  styleUrls: ['./dashboard-tab.component.css'],
})
export class DashboardTabComponent implements OnInit {
  @Input() investments: Iinvestment[] = [];
  @Input() opportunities: Iinvestment[] = [];
  @Input() wishlist: Iinvestment[] = [];
  private investmentService = inject(InvestmentService);

  loading = true;
  error: string | null = null;
  @Input() tabs: any;

  ngOnInit() {
    this.fetchInvestments();
  }

  fetchInvestments() {
    const investorId = '1';
    this.loading = true;
    this.investmentService.getInvestmentsByInvestorId(investorId).subscribe({
      next: (data) => {
        this.investments = data;
        this.error = null;
      },
      error: (err) => {
        this.error = 'Failed to load investments. Please try again.';
        console.error('Error fetching investments:', err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  getInvestmentsByStatus(status: 'active' | 'Pending' | 'completed') {
    return this.investments.filter(
      (investment) => investment.status === status
    );
  }
}
