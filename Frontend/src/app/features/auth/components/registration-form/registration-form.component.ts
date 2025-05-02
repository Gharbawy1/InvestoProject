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
    private authService: AuthService
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
        formData.append('idToken', this.googleRegister.idToken);
        formData.append('Role', this.googleRegister.Role);

        this.authService.handleGoogleLogin(formData).subscribe({
          next: (response) => {
            window.location.reload();
          },
          error: (error) => {
            console.error('Error occurred:', error);
          },
        });
      }
      this.registerService.registerGuest(this.data as IGuest).subscribe({
        next: (response) => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Error occurred:', error);
        },
      });
    } else {
      this.step++;
    }
  }

  handleIdentityVerificationSubmit(verificationData: FormData) {
    this.businessFormData = this.merge(this.data as IGuest, verificationData);

    if (this.selectedRole === 'business') {
      if (this.isGoogleLogin) {
        const original = this.businessFormData;
        const newFormData = new FormData();
        for (const [key, value] of original.entries()) {
          if (!['email', 'password', 'registerationDate'].includes(key)) {
            newFormData.append(key, value);
          }
        }
        this.googleRegister.businessOwnerData = newFormData;
        const formData = new FormData();
        formData.append('idToken', this.googleRegister.idToken);
        formData.append('Role', this.googleRegister.Role);
        if (this.googleRegister.businessOwnerData) {
          for (const [
            key,
            value,
          ] of this.googleRegister.businessOwnerData.entries()) {
            formData.append(`businessOwnerData.${key}`, value);
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
      }
      this.registerService.registerBusiness(this.businessFormData).subscribe({
        next: (response) => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Error occurred:', error);
        },
      });
    } else {
      this.step++;
    }
  }

  handleInvestmentPreferenceSubmit(data: InvestmentPreference) {
    this.investorFormData = this.merge(data, this.businessFormData);
    if (this.isGoogleLogin && this.selectedRole === 'investor') {
      const original = this.investorFormData;
      const newFormData = new FormData();
      for (const [key, value] of original.entries()) {
        if (!['email', 'password', 'registerationDate'].includes(key)) {
          newFormData.append(key, value);
        }
      }
      this.googleRegister.investorData = newFormData;
      const formData = new FormData();
      formData.append('idToken', this.googleRegister.idToken);
      formData.append('Role', this.googleRegister.Role);
      if (this.googleRegister.businessOwnerData) {
        for (const [
          key,
          value,
        ] of this.googleRegister.businessOwnerData.entries()) {
          formData.append(`businessOwnerData.${key}`, value);
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
    }
    this.registerService.registerInvestor(this.investorFormData).subscribe({
      next: (response) => {
        window.location.reload();
      },
      error: (error) => {
        console.error('Error occurred:', error);
      },
    });
  }

  loginWithGoogle() {
    this.isGoogleLogin = true;
    debugger;
    this.authService
      .loginWithGoogle()
      .then((googleResponse) => {
        this.googleRegister!.idToken = googleResponse.code;
        this.googleRegister.Role = this.selectedRole;
        console.log('Received ID Token:', this.googleRegister!.idToken);
        this.step++;
      })
      .catch((error) => {
        this.isGoogleLogin = false;
        console.error('Google login failed:', error);
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

  private googleRegisterToFormData(googleRegister: GoogleRegister): FormData {
    const formData = new FormData();

    formData.append('idToken', googleRegister.idToken);
    formData.append('Role', googleRegister.Role);

    if (googleRegister.investorData) {
      for (const [key, value] of googleRegister.investorData.entries()) {
        formData.append(`investorData.${key}`, value);
      }
    }

    if (googleRegister.businessOwnerData) {
      for (const [key, value] of googleRegister.businessOwnerData.entries()) {
        formData.append(`businessOwnerData.${key}`, value);
      }
    }

    return formData;
  }

  goBack() {
    this.step == 1 ? (this.step = 1) : this.step--;
  }
}
