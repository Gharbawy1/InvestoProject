import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, NgForm } from '@angular/forms';
import { ProgressIndicatorRegComponent } from "../progress-indicator-reg/progress-indicator-reg.component";
import { PersonalInfoRegComponent } from "../personal-info-reg/personal-info-reg.component";
import { IdentityVerificationComponent } from '../identity-verification/identity-verification.component';
import { InvestmentPreferenceComponent } from "../investment-preference/investment-preference.component";
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { AccountCreationComponent } from "../account-creation/account-creation.component";
import { IGuest } from '../../interfaces/iguest';
import { IInvestor } from '../../interfaces/iinvestor';
import { IBusiness } from '../../interfaces/ibusiness';

@Component({
  selector: 'app-registration-form',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ProgressIndicatorRegComponent, PersonalInfoRegComponent, IdentityVerificationComponent, InvestmentPreferenceComponent, AccountCreationComponent],
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css'],
})
export class RegistrationFormComponent {
  step = 1;
  selectedRole: 'investor' | 'business' | 'guest' = 'guest';
  formSubmitted = false;
  isLoading = false;
  data : IGuest | IInvestor | IBusiness | {} = {}; 
  constructor(private navigationService: NavigationService) {}

  setRole(role: 'investor' | 'business' | 'guest') {
    this.selectedRole = role;
  }
  
  get totalSteps(): number {
    switch (this.selectedRole) {
      case 'investor':
        return 4;
      case 'business':
        return 3;
      case 'guest':
        return 2;
      default:
        return 1;
    }
  }
  
  handleAccountCreationSubmit(data: any) {
    this.data = { ...this.data, ...data };
    this.step++;
  }

  handlePersonalInfoSubmit(personalData: any) {
    this.data = { ...this.data, ...personalData };
    if (this.selectedRole === 'guest') {
      //call api
    }else{
      this.step++;
    }
  }

  handleIdentityVerificationSubmit(data: any) { 
    this.data = { ...this.data, ...data };
    if (this.selectedRole === 'business') {
      //call api
    }else{
      this.step++;
    }
  }

  handleInvestmentPreferenceSubmit(data: any) {
    this.data = { ...this.data, ...data };
    this.navigationService.navigateByRole("investor")
    
    // call api
    
  }
}