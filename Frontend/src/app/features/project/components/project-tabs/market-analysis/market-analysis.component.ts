import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-market-analysis',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './market-analysis.component.html',
  styleUrls: ['./market-analysis.component.css']
})
export class MarketAnalysisComponent {
  @Input() analysis: string = `The urban farming market is projected to grow at a CAGR of 25% over the next five years, 
  driven by increasing demand for locally-sourced produce and sustainable food systems. Our target market includes 
  health-conscious consumers, restaurants focused on farm-to-table offerings, and institutional buyers like schools 
  and hospitals seeking to reduce their carbon footprint.`;
}