import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
  NgForm,
} from '@angular/forms';
import { ProgressIndicatorRegComponent } from '../progress-indicator-reg/progress-indicator-reg.component';
import { PersonalInfoRegComponent } from '../personal-info-reg/personal-info-reg.component';
import { IdentityVerificationComponent } from '../identity-verification/identity-verification.component';
import { InvestmentPreferenceComponent } from '../investment-preference/investment-preference.component';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { AccountCreationComponent } from '../account-creation/account-creation.component';
import { IGuest } from '../../interfaces/iguest';
import { IInvestor } from '../../interfaces/iinvestor';
import { IBusinessOwner } from '../../interfaces/ibusinessOwner';
import { HttpClient } from '@angular/common/http';
import { RegisterService } from '../../services/register.service';
import { IUser } from '../../interfaces/iuser';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

type RegistrationData = IGuest | IInvestor | IBusinessOwner;

@Component({
  selector: 'app-registration-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ProgressIndicatorRegComponent,
    PersonalInfoRegComponent,
    IdentityVerificationComponent,
    InvestmentPreferenceComponent,
    AccountCreationComponent,
  ],
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css'],
})
export class RegistrationFormComponent {
  step = 1;
  selectedRole: 'investor' | 'business' | 'guest' = 'guest';
  formSubmitted = false;

  data: RegistrationData | null = null;

  registerService = inject(RegisterService);
  authService = inject(AuthService);
  router = inject(Router);
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
    this.data = { ...this.data, ...personalData } as RegistrationData;
    if (this.selectedRole === 'guest') {
      this.registerService.registerGuest(this.data as IGuest).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.authService.currentUserSig.set(response);
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          console.error('Error occurred:', error);
        },
      });
    } else {
      this.step++;
    }
  }

  handleIdentityVerificationSubmit(data: any) {
    this.data = { ...this.data, ...data } as RegistrationData;
    if (this.selectedRole === 'business') {
      this.registerService
        .registerGuest(this.data as IBusinessOwner)
        .subscribe({
          next: (response) => {
            localStorage.setItem('token', response.token);
            this.authService.currentUserSig.set(response);
            this.navigationService.navigateByRole('businessOwner');
          },
          error: (error) => {
            console.error('Error occurred:', error);
          },
        });
    } else {
      this.step++;
    }
  }

  handleInvestmentPreferenceSubmit(data: any) {
    this.data = { ...this.data, ...data } as RegistrationData;
    this.registerService.registerGuest(this.data as IInvestor).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.authService.currentUserSig.set(response);
        this.navigationService.navigateByRole('investor');
      },
      error: (error) => {
        console.error('Error occurred:', error);
      },
    });
  }
}
