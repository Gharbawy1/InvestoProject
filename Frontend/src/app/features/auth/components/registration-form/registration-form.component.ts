import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProgressIndicatorRegComponent } from '../progress-indicator-reg/progress-indicator-reg.component';
import { PersonalInfoRegComponent } from '../personal-info-reg/personal-info-reg.component';
import { IdentityVerificationComponent } from '../identity-verification/identity-verification.component';
import {
  InvestmentPreference,
  InvestmentPreferenceComponent,
} from '../investment-preference/investment-preference.component';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { AccountCreationComponent } from '../account-creation/account-creation.component';
import { IGuest } from '../../interfaces/iguest';
import { RegisterService } from '../../services/register.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { GoogleRegister } from '../../interfaces/IGoogleReg';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonComponent } from '../../../../shared/componentes/button/button.component';
import { GoogleAuthService } from '../../../../core/services/googleSignIn/google-signin.service';

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
    ButtonComponent,
  ],
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css'],
})
export class RegistrationFormComponent {
  step = 1;
  selectedRole: 'investor' | 'business' | 'guest' = 'guest';
  formSubmitted = false;

  data: IGuest | null = null;
  businessFormData = new FormData();
  investorFormData = new FormData();
  isGoogleLogin: boolean = false;
  googleRegister: GoogleRegister = {} as GoogleRegister;

  registerService = inject(RegisterService);
  router = inject(Router);
  constructor(
    private navigationService: NavigationService,
    private authService: AuthService,
    private googleAuthService: GoogleAuthService
  ) {}

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

  handlePersonalInfoSubmit(personalData: IGuest) {
    this.data = { ...this.data, ...personalData } as IGuest;
    if (this.selectedRole === 'guest') {
      if (this.isGoogleLogin) {
        const formData = new FormData();
        formData.append('IdToken', this.googleRegister.IdToken);
        formData.append('Role', this.googleRegister.Role);
        this.authService.handleGoogleLogin(formData).subscribe({
          next: (response) => {
            this.authService.createCurrentUser(response, true);
            this.router.navigate(['/Home']);
          },
          error: (error) => {
            console.error('Error occurred:', error);
          },
        });
      } else {
        this.registerService.registerGuest(this.data as IGuest).subscribe({
          next: (response) => {
            window.location.reload();
          },
          error: (error) => {
            console.error('Error occurred:', error);
          },
        });
      }
    } else {
      this.step++;
    }
  }

  handleIdentityVerificationSubmit(verificationData: FormData) {
    this.businessFormData = this.merge(this.data as IGuest, verificationData);

    if (this.selectedRole === 'business') {
      if (this.isGoogleLogin) {
        this.googleRegister.BusinessOwnerData = this.businessFormData;
        const formData = new FormData();
        formData.append('IdToken', this.googleRegister.IdToken);
        formData.append('Role', this.googleRegister.Role);
        console.log(this.googleRegister.Role);
        debugger;
        if (this.googleRegister.BusinessOwnerData) {
          for (const [
            key,
            value,
          ] of this.googleRegister.BusinessOwnerData.entries()) {
            formData.append(`BusinessOwnerData.${key}`, value);
          }
        }
        this.authService.handleGoogleLogin(formData).subscribe({
          next: (response) => {
            window.location.reload();
          },
          error: (error) => {
            console.error('Error occurred:', error);
          },
        });
      } else {
        this.registerService.registerBusiness(this.businessFormData).subscribe({
          next: (response) => {
            window.location.reload();
          },
          error: (error) => {
            console.error('Error occurred:', error);
          },
        });
      }
    } else {
      this.step++;
    }
  }

  handleInvestmentPreferenceSubmit(data: InvestmentPreference) {
    this.investorFormData = this.merge(data, this.businessFormData);
    if (this.isGoogleLogin && this.selectedRole === 'investor') {
      this.googleRegister.InvestorData = this.investorFormData;
      const formData = new FormData();
      formData.append('IdToken', this.googleRegister.IdToken);
      formData.append('Role', this.googleRegister.Role);
      if (this.googleRegister.InvestorData) {
        for (const [key, value] of this.googleRegister.InvestorData.entries()) {
          formData.append(`InvestorData.${key}`, value);
        }
      }
      this.authService.handleGoogleLogin(formData).subscribe({
        next: (response) => {
          this.authService.createCurrentUser(response, true);
          this.router.navigate(['/Home']);
        },
        error: (error) => {
          console.error('Error occurred:', error);
        },
      });
    } else {
      this.registerService.registerInvestor(this.investorFormData).subscribe({
        next: (response) => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Error occurred:', error);
        },
      });
    }
  }

  registerWithGoogle() {
    this.isGoogleLogin = true;
    this.googleAuthService.initializeGoogleSignIn((response: any) => {
      if (response.credential) {
        const IdToken = response.credential;

        this.googleRegister.IdToken = IdToken;
        this.googleRegister.Role =
          this.selectedRole === 'guest'
            ? 'User'
            : this.selectedRole === 'business'
            ? 'BusinessOwner'
            : 'Investor';
        console.log('Received ID Token:', this.googleRegister.IdToken);
        this.step++;
      }
    });
  }

  merge(data: IGuest | InvestmentPreference, fileData: FormData): FormData {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    fileData.forEach((value, key) => {
      formData.append(key, value);
    });

    return formData;
  }

  goBack() {
    this.step == 1 ? (this.step = 1) : this.step--;
  }
}
