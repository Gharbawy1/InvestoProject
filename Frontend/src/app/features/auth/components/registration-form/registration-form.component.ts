import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  standalone: true,
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
    FontAwesomeModule,
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

  constructor(
    private navigationService: NavigationService,
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
    private registerService: RegisterService,
    private router: Router
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
      if (
        this.isGoogleLogin &&
        this.googleRegister.IdToken &&
        this.googleRegister.Role
      ) {
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
          next: () => this.router.navigate(['/Home']),
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
      if (
        this.isGoogleLogin &&
        this.googleRegister.IdToken &&
        this.googleRegister.Role
      ) {
        this.googleRegister.BusinessOwnerData = this.businessFormData;

        const formData = new FormData();
        formData.append('IdToken', this.googleRegister.IdToken.toString());
        formData.append('Role', this.googleRegister.Role);

        // تأكد من تحويل كل قيمة إلى string إذا لم تكن ملف
        for (const [key, value] of this.businessFormData.entries()) {
          const fullKey = `BusinessOwnerData.${this.toPascalCase(key)}`;
          formData.append(
            fullKey,
            value instanceof File ? value : value.toString()
          );
        }

        this.authService.handleGoogleLogin(formData).subscribe({
          next: () => this.router.navigate(['/Home']),
          error: (error) => console.error('Error occurred:', error),
        });
      } else {
        this.registerService.registerBusiness(this.businessFormData).subscribe({
          next: () => this.router.navigate(['/Home']),
          error: (error) => console.error('Error occurred:', error),
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
      formData.append('IdToken', this.googleRegister.IdToken.toString());
      formData.append('Role', this.googleRegister.Role);

      this.investorFormData.forEach((value, key) => {
        if (
          typeof value === 'number' ||
          value instanceof Number ||
          value instanceof Date
        ) {
          formData.append(`InvestorData.${key}`, value.toString());
        } else {
          formData.append(`InvestorData.${key}`, value);
        }
      });

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
        next: () => window.location.reload(),
        error: (error) => console.error('Error occurred:', error),
      });
    }
  }

  registerWithGoogle() {
    this.isGoogleLogin = true;
    this.googleAuthService.initializeGoogleSignIn((response: any) => {
      if (response.credential) {
        this.googleRegister.IdToken = response.credential;
        this.googleRegister.Role =
          this.selectedRole === 'guest'
            ? 'User'
            : this.selectedRole === 'business'
            ? 'BusinessOwner'
            : 'Investor';
        this.step++;
      }
    });
  }
  private toPascalCase(key: string): string {
    return key.replace(/(^\w|_\w)/g, (match) =>
      match.replace('_', '').toUpperCase()
    );
  }

  merge(data: IGuest | InvestmentPreference, fileData: FormData): FormData {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      const pascalKey = this.toPascalCase(key);
      formData.append(pascalKey, String(value));
    });

    fileData.forEach((value, key) => {
      const pascalKey = this.toPascalCase(key);
      formData.append(pascalKey, value);
    });

    return formData;
  }

  goBack() {
    if (this.step > 1) {
      this.step--;
    }
  }
}
