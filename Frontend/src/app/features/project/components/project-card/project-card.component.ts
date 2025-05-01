import { Component, Input, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IProjectCard } from '../../interfaces/iprojectcard';
import { ProjectCardService } from '../../services/project-card/project-card.service';
import { ButtonComponent } from '../../../../shared/componentes/button/button.component';

@Component({
  selector: 'app-project-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css'],
  providers: [ProjectCardService],
})
export class ProjectCardComponent implements OnInit {
  progressPercentage: number = 0;

  constructor(private progressPercentageService: ProjectCardService) {}
  @Input() projectData: IProjectCard = {} as IProjectCard;

  ngOnInit(): void {
    this.progressPercentage = this.progressPercentageService.progressPercentage(
      this.projectData.raisedFunds,
      this.projectData.fundingGoal
    );
  }
}
