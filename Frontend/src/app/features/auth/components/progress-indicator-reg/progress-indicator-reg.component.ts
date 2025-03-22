import { Component, Input  } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-indicator-reg',
  imports: [CommonModule],
  templateUrl: './progress-indicator-reg.component.html',
  styleUrls: ['./progress-indicator-reg.component.css']
})
export class ProgressIndicatorRegComponent {
  @Input() currentStep: number = 1;
  @Input() totalSteps: number = 4;
  
  get steps(): number[] {
    return Array.from({length: this.totalSteps}, (_, i) => i + 1);
  }
}
