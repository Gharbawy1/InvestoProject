import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { RemoveCommasPipe } from '../../../../shared/pipe/remove-commas.pipe';

@Component({
  selector: 'app-user-info-card',
  imports: [
    CommonModule,
    MatIconModule, 
    ReactiveFormsModule,
    RemoveCommasPipe
  ],
  templateUrl: './user-info-card.component.html',
  styleUrls: ['./user-info-card.component.css'],
})
export class UserInfoCardComponent {
  @Input() title!: string;
  @Input() data: Array<{ label: string; value: string }> = [];
  @Input() allowEdit: boolean = false;
  @Output() editClicked = new EventEmitter<void>();

  getRiskClass(riskLevel: string): string {
    const risk = riskLevel?.toLowerCase();
    return {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    }[risk] || 'bg-gray-100 text-gray-800';
  }

  isCurrencyField(label: string): boolean {
    const currencyLabels = [
      'Min Investment',
      'Max Investment', 
      'Net Worth',
      'Annual Income'
    ];
    return currencyLabels.includes(label);
  }
}
