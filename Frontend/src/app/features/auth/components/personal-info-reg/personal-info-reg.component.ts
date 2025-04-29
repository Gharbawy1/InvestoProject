import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AutoFocusDirective } from '../../../../shared/directives/auto-focus/auto-focus.directive';

@Component({
  selector: 'app-personal-info-reg',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AutoFocusDirective],
  templateUrl: './personal-info-reg.component.html',
  styleUrls: ['./personal-info-reg.component.css'],
})
export class PersonalInfoRegComponent {
  @Input() selectedRole!: string;
  @Output() submitted = new EventEmitter<any>();

  formSubmitted = false;
  personalInfoForm: FormGroup;

  currentYear = new Date().getFullYear();
  days: number[] = [];
  months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 },
  ];
  years: number[] = [];

  constructor(private fb: FormBuilder) {
    this.personalInfoForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-z\s']+$/),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-z\s']+$/),
        ],
      ],
      birthDay: ['', Validators.required],
      birthMonth: ['', Validators.required],
      birthYear: ['', Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\+(?:[0-9]\x20?){6,14}[0-9]$/),
        ],
      ],
    });
  }

  ngOnInit() {
    this.generateDateOptions();
    this.setupDateValidation();
  }

  private generateDateOptions() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from(
      { length: currentYear - 1900 + 1 },
      (_, i) => currentYear - i
    );
    this.days = Array.from({ length: 31 }, (_, i) => i + 1);
  }

  private setupDateValidation() {
    this.personalInfoForm
      .get('birthMonth')
      ?.valueChanges.subscribe(() => this.updateDays());
    this.personalInfoForm
      .get('birthYear')
      ?.valueChanges.subscribe(() => this.updateDays());
    this.personalInfoForm.setValidators([this.validateDate.bind(this)]);
  }

  private updateDays() {
    const month = this.personalInfoForm.get('birthMonth')?.value;
    const year = this.personalInfoForm.get('birthYear')?.value;

    if (month && year) {
      const daysInMonth = new Date(year, month, 0).getDate();
      this.days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

      const currentDay = this.personalInfoForm.get('birthDay')?.value;
      if (currentDay > daysInMonth) {
        this.personalInfoForm.get('birthDay')?.reset();
      }
    }
  }

  private validateDate(form: AbstractControl) {
    const day = form.get('birthDay')?.value;
    const month = form.get('birthMonth')?.value;
    const year = form.get('birthYear')?.value;

    if (!day || !month || !year) return null;

    const date = new Date(year, month - 1, day);
    const isValid =
      date.getFullYear() == year &&
      date.getMonth() + 1 == month &&
      date.getDate() == day;

    return isValid ? null : { invalidDate: true };
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.personalInfoForm.invalid) return;

    const formValues = this.personalInfoForm.value;

    const guest: any = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      birthDate: this.formatBirthDate(
        formValues.birthYear,
        formValues.birthMonth,
        formValues.birthDay
      ),
      registrationDate: new Date().toISOString(),
      phoneNumber: formValues.phone,
    };

    this.submitted.emit(guest);
  }

  private formatBirthDate(year: number, month: number, day: number): string {
    const date = new Date(year, month - 1, day);
    return date.toISOString();
  }
}
