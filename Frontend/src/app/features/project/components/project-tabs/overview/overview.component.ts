import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TeamMembersComponent } from '../team-members/team-members.component';
import { MarketAnalysisComponent } from '../market-analysis/market-analysis.component';
import { Project } from '../../../services/business-details/business-details.service';
import { ProjectContextService } from '../../../services/project-context.service';

@Component({
  selector: 'app-overview',
  imports: [CommonModule, MatIconModule, TeamMembersComponent, MarketAnalysisComponent],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  project: Project | null = null;

  constructor(private ctx: ProjectContextService) {}

  ngOnInit() {
    this.ctx.project$.subscribe(p => this.project = p);
  }
}
