import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProjectContextService } from '../../../services/project-context.service';
import { IBusinessDetails } from '../../../interfaces/IBusinessDetails';

@Component({
  selector: 'app-financials',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './financials.component.html',
  styleUrls: ['./financials.component.css'],
})
export class FinancialsComponent implements OnInit {
  project: IBusinessDetails | null = null;

  constructor(private ctx: ProjectContextService) {}

  ngOnInit() {
    this.ctx.project$.subscribe((p) => (this.project = p));
  }
}
