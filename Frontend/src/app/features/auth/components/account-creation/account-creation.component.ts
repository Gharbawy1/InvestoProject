import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { EyePasswordComponent } from '../../../../shared/componentes/eye-password/eye-password.component';
import { AutoFocusDirective } from '../../../../shared/directives/auto-focus/auto-focus.directive';

@Component({
  selector: 'app-account-creation',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EyePasswordComponent,
    AutoFocusDirective,
  ],
  templateUrl: './account-creation.component.html',
  styleUrls: ['./account-creation.component.css'],
})
export class AccountCreationComponent {
  step: number = 1;
  @Output() roleChange = new EventEmitter<'investor' | 'business' | 'guest'>();
  selectedRole: 'investor' | 'business' | 'guest' = 'guest';
  setRole(role: 'investor' | 'business' | 'guest') {
    this.selectedRole = role;
    this.roleChange.emit(role);
  }

  @Output() submitted = new EventEmitter<any>();

  form: FormGroup;
  formSubmitted = false;

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(12)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordRequirements = [
    { label: 'At least 12 characters long', validator: 'minlength' },
    { label: 'Contains a lowercase letter', validator: 'lowercase' },
    { label: 'Contains an uppercase letter', validator: 'uppercase' },
    { label: 'Contains a number', validator: 'number' },
    {
      label: 'Contains a special character (!@#$%^&*)',
      validator: 'specialCharacter',
    },
  ];

  isRequirementMet(validatorName: string): boolean {
    const control = this.form.get('password');
    if (!control || control.pristine) return false;

    switch (validatorName) {
      case 'minlength':
        return control.value?.length >= 12;
      case 'lowercase':
        return /[a-z]/.test(control.value);
      case 'uppercase':
        return /[A-Z]/.test(control.value);
      case 'number':
        return /\d/.test(control.value);
      case 'specialCharacter':
        return /[!@#$%^&*]/.test(control.value);
      default:
        return false;
    }
  }

  onPasswordInput() {
    const passwordControl = this.form.get('password');
    passwordControl?.markAsTouched();
    passwordControl?.updateValueAndValidity();
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    } else {
      this.submitted.emit(this.form.value);
    }
  }
}
