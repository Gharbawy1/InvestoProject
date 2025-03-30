import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Define the structure for a trend indicator.
interface Trend {
  type: 'positive' | 'negative' | 'neutral';
  value?: string;
}

// Define the structure for a stat card.
interface Stat {
  label: string;
  value: string;
  icon: string;
  trend?: Trend;
  progress?: {
    percentage: number;
    target: string;
  };
}

@Component({
  selector: 'app-stats-cards',
  imports: [ CommonModule ],
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.css']
})
export class StatsCardsComponent implements OnInit {
  // Flags for loading and error states.
  isLoading = true;
  error = false;
  // Array used for rendering loading skeleton cards.
  skeletonStats: any[] = Array(8).fill({});

  // Array of statistics to be displayed in the cards.
  stats: Stat[] = [
    { 
      label: 'Total Funding', 
      value: '$125,000', 
      icon: 'attach_money',
      trend: { type: 'positive', value: '+12.4%' },
      progress: {
        percentage: 75,
        target: '$150k goal'
      }
    },
    { 
      label: 'Total Investors', 
      value: '42', 
      icon: 'people', 
      trend: { type: 'positive', value: '+5' } 
    },
    { 
      label: 'Funded Projects', 
      value: '1', 
      icon: 'trending_up', 
      trend: { type: 'positive', value: '+1'} 
    },
    { 
      label: 'Avg. Investment/Investor', 
      value: '$4,500', 
      icon: 'avg_investment', 
      trend: { type: 'positive', value: '+8%' } 
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
      trend: { type: 'positive', value: '+2%' } 
    },
    { 
      label: 'Engagement Stats', 
      value: '3.5K', 
      icon: 'engagement', 
      trend: { type: 'positive', value: '+10%' } 
    },
    { 
      label: 'Doc Verification Status', 
      value: '3 Pending', 
      icon: 'document', 
      trend: { type: 'neutral', value: '' } 
    }
  ];

  constructor() { }

  /**
   * loadStats
   * Simulates an API call to load statistics. Sets loading state accordingly.
   * In a production environment, replace this with a real API call.
   */
  async loadStats() {
    try {
      this.isLoading = true;
      this.error = false;
      // Simulate network delay with a timeout.
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.isLoading = false;
    } catch (err) {
      // If an error occurs, set the error flag.
      this.error = true;
      this.isLoading = false;
    }
  }

  /**
   * ngOnInit
   * Angular lifecycle hook that initializes the component.
   * Calls loadStats to simulate fetching data.
   */
  ngOnInit(): void {
    this.loadStats();
  }
}