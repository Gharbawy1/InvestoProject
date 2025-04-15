import { Component, EventEmitter, Output, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-page.component.html',
})
export class PaymentPageComponent {
  projectId: string | null;
  amount: number = 1000;
  paymentMethod = signal<'card' | 'bank'>('card');
  paymentStatus = signal<'pending' | 'processing' | 'completed'>('pending');

  cardDetails = {
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  };

  @Output() paymentComplete = new EventEmitter<void>();

  constructor(private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
  }

  handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.cardDetails = { ...this.cardDetails, [target.name]: target.value };
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    this.paymentStatus.set('processing');

    setTimeout(() => {
      this.paymentStatus.set('completed');
      this.paymentComplete.emit();
    }, 2000);
  }
}