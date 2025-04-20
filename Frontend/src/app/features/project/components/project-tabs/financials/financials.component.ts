import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface FinancialHighlight {
  label: string;
  value: string;
}

@Component({
  selector: 'app-financials',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule],
  templateUrl: './financials.component.html',
  styleUrls: ['./financials.component.css']
})
export class FinancialsComponent {
  @Input() financialHighlights: FinancialHighlight[] = [
    { label: "Initial Investment", value: "$250,000" },
    { label: "Projected Annual Revenue", value: "$420,000" },
    { label: "Break-even Point", value: "18 months" },
    { label: "5-Year ROI", value: "215%" },
    { label: "Profit Margin", value: "32%" },
    { label: "Investor Equity Offered", value: "15%" },
  ];
}