import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-investment-preference',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './investment-preference.component.html',
  styleUrls: ['./investment-preference.component.css']
})
export class InvestmentPreferenceComponent {
  @Input() selectedRole!: 'investor' | 'business';
  @Output() submitted = new EventEmitter<any>();
  
  investorPreferenceForm: FormGroup;

  isLoading = false;
  formSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.investorPreferenceForm = this.fb.group({
      preferredIndustries: ['', Validators.required],
      geographicFocus: ['', Validators.required],
      riskTolerance: ['', Validators.required],
      investmentGoals: ['', Validators.required],
      minInvestment: [null, [Validators.required, Validators.min(0)]],
      maxInvestment: [null, [Validators.required, Validators.min(0)]],
      liquidityPreferences: ['', Validators.required]
    }, { validators: this.investmentRangeValidator });
  }

  investmentRangeValidator(control: AbstractControl) {
    const min = control.get('minInvestment')?.value;
    const max = control.get('maxInvestment')?.value;
    if (min !== null && max !== null && min > max) {
      return { maxLessThanMin: true };
    }
    return null;
  }

  onSubmit() {
    this.formSubmitted = true;
    
    if (this.investorPreferenceForm.invalid) return;

    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.submitted.emit({
        ...this.investorPreferenceForm.value,
      });
    }, 1000);
  }
}
