import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demographic-card',
  imports: [ CommonModule ],
  templateUrl: './demographic-card.component.html',
  styleUrls: ['./demographic-card.component.css']
})
export class DemographicCardComponent {

  public demographics = {
    male: 65,
    female: 35,
    ageGroups: [
      { label: '18-24', percentage: 15 },
      { label: '25-34', percentage: 40 },
      { label: '35-44', percentage: 25 },
      { label: '45+', percentage: 20 },
    ]
  };
}
