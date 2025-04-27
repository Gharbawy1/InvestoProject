import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.css'],
})
export class TeamMembersComponent {
  @Input() teamMembers: TeamMember[] = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    // ... other team members
  ];
}
