import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

interface Update {
  date: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-updates',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.css']
})
export class UpdatesComponent {
  @Input() updates: Update[] = [
    {
      date: "2023-10-15",
      title: "Site Selection Completed",
      content: "We've finalized the location for our first urban farm installation. The 2-acre site in East Portland offers excellent access to transportation and utilities while being centrally located to serve multiple communities."
    },
    {
      date: "2023-09-01",
      title: "Partnership with Local Restaurants",
      content: "We're excited to announce partnerships with 12 local restaurants who have committed to purchasing produce from our urban farm once operational. This represents approximately 40% of our projected initial capacity."
    },
    {
      date: "2023-08-15",
      title: "Sustainability Grant Awarded",
      content: "Green City Ventures has been awarded a $50,000 sustainability grant from the State Environmental Fund, which will be used to implement advanced rainwater harvesting systems in our urban farm design."
    }
  ];
}