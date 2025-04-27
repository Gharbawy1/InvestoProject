import { Component, OnInit } from '@angular/core';
import { CommonModule }     from '@angular/common';
import { MatIconModule }    from '@angular/material/icon';
import { ProjectContextService } from '../../../services/project-context.service';
import { Project }          from '../../../services/business-details/business-details.service';

@Component({
  selector: 'app-business-info',
  imports: [ CommonModule, MatIconModule ],
  templateUrl: './business-info.component.html'
})
export class BusinessInfoComponent implements OnInit {
  project: Project | null = null;

  constructor(private ctx: ProjectContextService) {}

  ngOnInit() {
    this.ctx.project$.subscribe(p => this.project = p);
  }
}
