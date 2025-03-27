import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Trend {
  type: 'positive' | 'negative' | 'neutral';
  value?: string;
  timeframe?: string;
}

interface Stat {
  label: string;
  value: string;
  icon: string;
  trend?: Trend;
}

@Component({
  selector: 'app-stats-cards',
  imports: [ CommonModule ],
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.css']
})
export class StatsCardsComponent implements OnInit {
  // Update these stats as needed—for example, if "Active Projects" is managed separately.
  stats: Stat[] = [
    { 
      label: 'Total Funding', 
      value: '$125,000', 
      icon: 'attach_money', 
      trend: { type: 'positive', value: '+12.4%', timeframe: 'MoM' } 
    },
    { 
      label: 'Total Investors', 
      value: '42', 
      icon: 'people', 
      trend: { type: 'positive', value: '+5', timeframe: 'MoM' } 
    },
    { 
      label: 'Funded Projects', 
      value: '1', 
      icon: 'trending_up', 
      trend: { type: 'positive', value: '+1', timeframe: 'YoY' } 
    },
    { 
      label: 'Avg. Investment/Investor', 
      value: '$4,500', 
      icon: 'avg_investment', 
      trend: { type: 'positive', value: '+8%', timeframe: 'MoM' } 
    },
    { 
      label: 'Pending Investment Requests', 
      value: '5', 
      icon: 'pending', 
      trend: { type: 'neutral', value: '' } 
    },
    { 
      label: 'ROI / Return Projections', 
      value: '18%', 
      icon: 'roi', 
      trend: { type: 'positive', value: '+2%', timeframe: 'YoY' } 
    },
    { 
      label: 'Engagement Stats', 
      value: '3.5K', 
      icon: 'engagement', 
      trend: { type: 'positive', value: '+10%', timeframe: 'MoM' } 
    },
    { 
      label: 'Doc Verification Status', 
      value: '3 Pending', 
      icon: 'document', 
      trend: { type: 'neutral', value: '' } 
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // In a production application, load dynamic stats from your API.
  }
}
