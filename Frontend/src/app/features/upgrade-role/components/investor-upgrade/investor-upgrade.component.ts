import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UpgradeService } from '../../services/UpgradeService/Upgrade.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ObjectApiResponse } from '../../../../core/interfaces/ApiResponse';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { UpgradeResponse } from '../../interfaces/UpgradeResponse ';
import { ButtonComponent } from '../../../../shared/componentes/button/button.component';

@Component({
  selector: 'app-investor-upgrade',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './investor-upgrade.component.html',
  styleUrls: ['./investor-upgrade.component.css'],
})
export class InvestorUpgradeComponent implements OnInit {
  form: any;
  loading = false;
  errorMsg?: string;
  success = false;
  uploadProgress: number | null = null;
  maxFileSizeMB = 5;
  allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

  constructor(
    private fb: FormBuilder,
    private svc: UpgradeService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.validateInvestmentRange();
  }

  private initializeForm(): void {
    this.form = this.fb.group(
      {
        RiskTolerance: ['', Validators.required],
        InvestmentGoals: ['', Validators.required],
        NationalID: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[0-9]/),
            Validators.minLength(14),
            Validators.maxLength(14),
          ],
        ],
        MinInvestmentAmount: [null, [Validators.required, Validators.min(0)]],
        MaxInvestmentAmount: [null, [Validators.required, Validators.min(0)]],
        AccreditationStatus: ['', Validators.required],
        NetWorth: [null, [Validators.required, Validators.min(0)]],
        AnnualIncome: [null, [Validators.required, Validators.min(0)]],
        NationalIDImageFrontURL: [
          null,
          [Validators.required, this.fileValidator],
        ],
        NationalIDImageBackURL: [
          null,
          [Validators.required, this.fileValidator],
        ],
        ProfilePictureURL: [null, [Validators.required, this.fileValidator]],
      },
      { validators: this.validateMinMax }
    );
  }

  private validateMinMax(group: FormGroup): ValidationErrors | null {
    const min = group.get('MinInvestmentAmount')?.value;
    const max = group.get('MaxInvestmentAmount')?.value;

    if (min !== null && max !== null && min >= max) {
      return { minGreaterThanMax: true };
    }
    return null;
  }

  validateInvestmentRange() {
    const minControl = this.form.get('MinInvestmentAmount');
    const maxControl = this.form.get('MaxInvestmentAmount');

    if (minControl.value > maxControl.value) {
      maxControl.setErrors({ invalidMax: true });
    } else {
      maxControl.setErrors(null);
    }
  }

  getNationalIDErrors() {
    const control = this.form.get('NationalID');
    if (!control) return '';

    if (control.hasError('required')) {
      return 'National ID is required';
    }
    if (control.hasError('pattern')) {
      return 'Must contain only numbers';
    }
    if (control.hasError('minlength') || control.hasError('maxlength')) {
      return 'Must be exactly 14 digits';
    }
    return '';
  }

  restrictToNumbers(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ];
    const isDigit = event.key >= '0' && event.key <= '9';

    if (!isDigit && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  private fileValidator(control: any) {
    const file = control.value as File;
    if (!file) return { required: true };
    return null;
  }

  onFileSelect(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Mark the field as touched
    this.form.get(field)?.markAsTouched();

    // Clear previous errors
    this.form.get(field)?.setErrors(null);
    this.errorMsg = undefined;

    const validationError = this.validateFile(file);
    if (validationError) {
      this.form.get(field)?.setErrors({ [validationError.type]: true });
      return;
    }

    this.form.patchValue({ [field]: file });
    this.form.get(field)?.updateValueAndValidity();
  }

  private validateFile(file: File): { type: string; message: string } | null {
    if (!this.allowedTypes.includes(file.type)) {
      return { type: 'invalidType', message: 'Invalid file type' };
    }

    if (file.size > this.maxFileSizeMB * 1024 * 1024) {
      return { type: 'invalidSize', message: 'File too large' };
    }

    return null;
  }

  getFileError(field: string): string {
    const control = this.form.get(field);
    if (!control?.errors) return '';

    if (control.hasError('required')) return 'This file is required';
    if (control.hasError('invalidType'))
      return 'Invalid file type. Allowed: JPEG, PNG, PDF';
    if (control.hasError('invalidSize'))
      return `File size exceeds ${this.maxFileSizeMB}MB`;

    return '';
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    // Append form values
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      if (control.value instanceof File) {
        formData.append(key, control.value, control.value.name);
      } else {
        formData.append(key, control.value);
      }
    });

    this.loading = true;
    this.uploadProgress = 0;
    this.errorMsg = undefined;

    this.svc.upgradeToInvestor(formData).subscribe({
      next: (evt) => {
        this.router.navigateByUrl('/auth');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Upgrade error:', err);
        this.errorMsg =
          err.error?.errorMessage ||
          err.message ||
          'Upgrade failed. Please try again.';
        this.loading = false;
        this.uploadProgress = null;
      },
    });
  }

  goBack() {
    this.router.navigateByUrl('/Home');
  }
}
