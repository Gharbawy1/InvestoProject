import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { DashboardBusiness } from '../../interfaces/IDashboardBusiness';
import { OfferService } from '../../../project/services/offer/offer.service';
import { IOfferProfile } from '../../../project/interfaces/IOfferProfile';

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
  progress?: { percentage: number; target: string };
}

@Component({
  selector: 'app-stats-cards',
  imports: [CommonModule, MatIconModule],
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.css'],
})
export class StatsCardsComponent implements OnInit {
  @Input() project: DashboardBusiness | null = null;

  investmentRanges: { range: string; percentage: number }[] = [];

  constructor(private offerService: OfferService) {}
  
  ngOnInit() {
    // if project is already set at init
    this.loadRanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    // whenever `project` changes, recompute
    if (changes['project'] && !changes['project'].firstChange) {
      this.loadRanges();
    }
  }

  private loadRanges() {
    if (!this.project?.id) {
      this.investmentRanges = [];
      return;
    }

    this.offerService
      .getOfferforProject(this.project.id)
      .subscribe((offers: IOfferProfile[]) => {
        // 1) filter only Accepted
        const accepted = offers.filter(o => o.status === 'Accepted');

        // 2) extract amounts
        const amounts = accepted.map(o => o.offerAmount);

        // 3) bucket them
        this.investmentRanges = this.computeBuckets(amounts);
      });
  }

  private computeBuckets(amounts: number[]) {
    const total = amounts.length;
    const buckets = [
      { label: '0 – 10 000 LE',    min: 0,     max: 10000,  count: 0 },
      { label: '10 001 – 50 000 LE',min: 10001, max: 50000,  count: 0 },
      { label: '50 001+ LE',        min: 50001, max: Infinity, count: 0 },
    ];

    amounts.forEach(a => {
      const b = buckets.find(b => a >= b.min && a <= b.max);
      if (b) b.count++;
    });

    return buckets.map(b => ({
      range: b.label,
      percentage: total ? Math.round((b.count / total) * 100) : 0
    }));
  }

  getFundingPercentage(): number {
    if (!this.project) return 0;
    
    if (this.project.fundingGoal <= 0) return 0;
    
    const percentage = (this.project.raisedFund / this.project.fundingGoal) * 100;
    return Math.min(percentage, 100);
  }

  getAverageInvestment(): number {
    if (!this.project || this.project.investorsCount === 0) return 0;
    return this.project.raisedFund / this.project.investorsCount;
  }

  getProjectPhase(): string {
    const progress = this.getFundingPercentage();
    if (progress < 25) return 'Initial Funding Stage';
    if (progress < 75) return 'Growth Phase';
    return 'Final Funding Push';
  }

  // Flags for loading and error states.
  /*isLoading = true;
  error = false;
  // Array used for rendering loading skeleton cards.
  skeletonStats: any[] = Array(8).fill({});

  // Inline SVG definitions
  // SVG definitions (stroke-width: 1.5, no color classes)
  private moneySvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
  private peopleSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>`;
  private descriptionSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>`;
  private avgInvestmentSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg>`;
  private pendingSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
  private roiSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
  private engagementSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V2.75a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"/></svg>`;
  private documentSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>`;
  private messageSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>`;  
  
  // Centralized icon & color map
  iconMap: Record<string, { svg: SafeHtml; bgClass: string; textClass: string }> = {};
  constructor(private sanitizer: DomSanitizer) {
    this.iconMap = {
      attach_money: { 
        svg: this.safeSvg(this.moneySvg),
        bgClass: 'bg-green-100/70',
        textClass: 'text-green-600'
      },
      people: {
        svg: this.safeSvg(this.peopleSvg),
        bgClass: 'bg-blue-100/70',
        textClass: 'text-blue-600'
      },
      description: {
        svg: this.safeSvg(this.descriptionSvg),
        bgClass: 'bg-purple-100/70',
        textClass: 'text-purple-600'
      },
      avg_investment: {
        svg: this.safeSvg(this.avgInvestmentSvg),
        bgClass: 'bg-indigo-100/70',
        textClass: 'text-indigo-600'
      },
      pending: {
        svg: this.safeSvg(this.pendingSvg),
        bgClass: 'bg-amber-100/70',
        textClass: 'text-amber-600'
      },
      roi: {
        svg: this.safeSvg(this.roiSvg),
        bgClass: 'bg-cyan-100/70',
        textClass: 'text-cyan-600'
      },
      engagement: {
        svg: this.safeSvg(this.engagementSvg),
        bgClass: 'bg-pink-100/70',
        textClass: 'text-pink-600'
      },
      document: {
        svg: this.safeSvg(this.documentSvg),
        bgClass: 'bg-red-100/70',
        textClass: 'text-red-600'
      },
      message: {
        svg: this.safeSvg(this.messageSvg),
        bgClass: 'bg-teal-100/70',
        textClass: 'text-teal-600'
      },
    };
  }

  private safeSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  // Array of statistics to be displayed in the cards.
  stats: Stat[] = [
    {
      label: 'Total Funding',
      value: '$125,000',
      icon: 'attach_money',
      trend: { type: 'positive', value: '+12.4%' },
      progress: {
        percentage: 75,
        target: '$150k goal',
      },
    },
    {
      label: 'Total Investors',
      value: '42',
      icon: 'people',
      trend: { type: 'positive', value: '+5' },
    },
    {
      label: 'Avg. Investment/Investor',
      value: '$4,500',
      icon: 'avg_investment',
      trend: { type: 'positive', value: '+8%' },
    },
    {
      label: 'Pending Investment Requests',
      value: '5',
      icon: 'pending',
      trend: { type: 'neutral', value: '' },
    },
    {
      label: 'ROI / Return Projections',
      value: '18%',
      icon: 'roi',
      trend: { type: 'positive', value: '+2%' },
    },
    {
      label: 'Engagement Stats',
      value: '3.5K',
      icon: 'engagement',
      trend: { type: 'positive', value: '+10%' },
    },
    {
      label: 'Doc Verification Status',
      value: '3 Pending',
      icon: 'document',
      trend: { type: 'neutral', value: '' },
    },
    {
      label: 'New Messages',
      value: '2',
      icon: 'message',
      trend: { type: 'neutral' },
    },
  ];


  async loadStats() {
    try {
      this.isLoading = true;
      this.error = false;
      // Simulate network delay with a timeout.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      this.isLoading = false;
    } catch (err) {
      // If an error occurs, set the error flag.
      this.error = true;
      this.isLoading = false;
    }
  }

  ngOnInit(): void {
    this.loadStats();
  }*/
}
