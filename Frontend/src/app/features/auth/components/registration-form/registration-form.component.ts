import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, NgForm } from '@angular/forms';
import { ProgressIndicatorRegComponent } from "../progress-indicator-reg/progress-indicator-reg.component";
import { PersonalInfoRegComponent } from "../personal-info-reg/personal-info-reg.component";
import { IdentityVerificationComponent } from '../identity-verification/identity-verification.component';
import { InvestmentPreferenceComponent } from "../investment-preference/investment-preference.component";
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { AccountCreationComponent } from "../account-creation/account-creation.component";

@Component({
  selector: 'app-registration-form',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ProgressIndicatorRegComponent, PersonalInfoRegComponent, IdentityVerificationComponent, InvestmentPreferenceComponent, AccountCreationComponent],
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css'],
})
export class RegistrationFormComponent {
  step = 1;
  selectedRole: 'investor' | 'business' = 'investor';
  formSubmitted = false;
  isLoading = false;

  constructor(private navigationService: NavigationService) {}

  setRole(role: 'investor' | 'business') {
    this.selectedRole = role;
  }

  handleAccountCreationSubmit(data: any) {
    console.log('Account Creation Data:', data);
    this.step++;
  }

  handlePersonalInfoSubmit(personalData: any) {
    console.log('Personal Data:', personalData);
    this.step++;
  }

  handleIdentityVerificationSubmit(data: any) { 
    console.log('Identity Verification Data:', data);
    this.step++;
  }

  handleInvestmentPreferenceSubmit(data: any) {
    console.log('Investment Preference Data:', data);
    this.navigationService.navigateByRole("investor")
  }
}