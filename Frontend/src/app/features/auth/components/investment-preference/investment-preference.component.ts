import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface InvestmentPreference {
  RiskTolerance: string;
  InvestmentGoals: string;
  MinInvestmentAmount: number;
  MaxInvestmentAmount: number;
  AccreditationStatus: string;
  NetWorth: number;
  AnnualIncome: number;
}

@Component({
  selector: 'app-investment-preference',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './investment-preference.component.html',
  styleUrls: ['./investment-preference.component.css'],
})
export class InvestmentPreferenceComponent {
  @Input() selectedRole!: 'investor' | 'business' | 'guest';
  @Output() submitted = new EventEmitter<InvestmentPreference>();

  investorPreferenceForm: FormGroup;
  formSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.investorPreferenceForm = this.fb.group(
      {
        RiskTolerance: ['', Validators.required],
        InvestmentGoals: ['', Validators.required],
        MinInvestmentAmount: [null, [Validators.required, Validators.min(0)]],
        MaxInvestmentAmount: [null, [Validators.required, Validators.min(0)]],
        AccreditationStatus: ['', Validators.required],
        NetWorth: [null, [Validators.required, Validators.min(0)]],
        AnnualIncome: [null, [Validators.required, Validators.min(0)]],
      },
      { validators: this.investmentRangeValidator }
    );
  }

  investmentRangeValidator(control: AbstractControl) {
    const min = control.get('MinInvestmentAmount')?.value;
    const max = control.get('MaxInvestmentAmount')?.value;
    if (min !== null && max !== null && min > max) {
      return { maxLessThanMin: true };
    }
    return null;
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.investorPreferenceForm.invalid) return;

    const value = this.investorPreferenceForm.value as InvestmentPreference;
    this.submitted.emit(value);
  }
}
