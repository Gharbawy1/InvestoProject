import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ProjectContextService } from '../../../services/project-context/project-context.service';
import { IBusinessDetails } from '../../../interfaces/IBusinessDetails';

@Component({
  selector: 'app-business-info',
  imports: [CommonModule, MatIconModule],
  templateUrl: './business-info.component.html',
})
export class BusinessInfoComponent implements OnInit {
  project: IBusinessDetails | null = null;

  constructor(private ctx: ProjectContextService) {}

  ngOnInit() {
    this.ctx.project$.subscribe((p) => (this.project = p));
  }
}
