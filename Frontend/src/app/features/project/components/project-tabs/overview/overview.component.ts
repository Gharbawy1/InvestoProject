import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ProjectContextService } from '../../../services/project-context/project-context.service';
import { IBusinessDetails } from '../../../interfaces/IBusinessDetails';

@Component({
  selector: 'app-overview',
  imports: [CommonModule, MatIconModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  project: IBusinessDetails | null = null;

  constructor(private ctx: ProjectContextService) {}

  ngOnInit() {
    this.ctx.project$.subscribe((p) => (this.project = p));
  }
}
