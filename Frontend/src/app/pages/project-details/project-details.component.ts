import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProjectTabsComponent } from '../../features/project/components/project-tabs/project-tabs.component';
import { InvestmentSidebarComponent } from '../../features/project/components/investment-sidebar/investment-sidebar.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProjectTabsComponent,
    InvestmentSidebarComponent,
    MatIconModule
  ],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent {
  @Input() id?: string;
  @Input() title = "Eco-Friendly Urban Farm Initiative";
  @Input() businessName = "Green City Ventures";
  @Input() description = "A sustainable urban farming project...";
  // ... (all other inputs from React component)

  thumbnailUrl = "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8...";
  progressPercentage = Math.min(Math.round((125000 / 250000) * 100), 100);

  constructor(private route: ActivatedRoute) {
    this.id = this.id ?? this.route.snapshot.paramMap.get('id') ?? '';
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
}