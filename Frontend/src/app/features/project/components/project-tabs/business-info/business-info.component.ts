import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-business-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './business-info.component.html'
})
export class BusinessInfoComponent {
  @Input() businessData: any;
}