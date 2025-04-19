import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-projects-tab',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './projects-tab.component.html',
  styleUrls: ['./projects-tab.component.css']
})
export class ProjectsTabComponent {
  constructor() { }

  // Sample projects data. In a production environment, this would be fetched from an API.
  projects = [
    {
      id: '1',
      title: 'Eco-Friendly Urban Farm Initiative',
      fundingProgress: 125000,
      fundingGoal: 250000,
      status: 'active',
      investors: 42,
      createdAt: '2023-10-01',
    },
    {
      id: '2',
      title: 'Community Garden Expansion',
      fundingProgress: 75000,
      fundingGoal: 75000,
      status: 'Funded',
      investors: 28,
      createdAt: '2023-11-15',
    },
    {
      id: '3',
      title: 'Sustainable Water System',
      fundingProgress: 200000,
      fundingGoal: 200000,
      status: 'funded',
      investors: 56,
      createdAt: '2023-08-20',
    },
  ];
}