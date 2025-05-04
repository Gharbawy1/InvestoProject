import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpgradeService } from '../../services/UpgradeService/Upgrade.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  HttpErrorResponse,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { ObjectApiResponse } from '../../../../core/interfaces/ApiResponse';
import { UpgradeResponse } from '../../interfaces/UpgradeResponse ';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ButtonComponent } from '../../../../shared/componentes/button/button.component';

@Component({
  selector: 'app-owner-upgrade',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinner,
    ButtonComponent,
  ],
  templateUrl: './owner-upgrade.component.html',
  styleUrls: ['./owner-upgrade.component.css'],
})
export class OwnerUpgradeComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  errorMsg?: string;
  success = false;
  submitted = false;
  uploadProgress: number | null = null;
  maxFileSizeMB = 5;
  allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

  constructor(
    private fb: FormBuilder,
    private svc: UpgradeService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      NationalID: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]/),
          Validators.minLength(14),
          Validators.maxLength(14),
        ],
      ],
      NationalIDImageFrontURL: [
        null,
        [Validators.required, this.fileValidator],
      ],
      NationalIDImageBackURL: [null, [Validators.required, this.fileValidator]],
      ProfilePictureURL: [null, [Validators.required, this.fileValidator]],
    });
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

  onFileSelect(
    event: Event,
    field:
      | 'NationalIDImageFrontURL'
      | 'NationalIDImageBackURL'
      | 'ProfilePictureURL'
  ) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.form.get(field)?.setErrors(null);
    this.errorMsg = undefined;

    const validationError = this.validateFile(file);
    if (validationError) {
      this.form.get(field)?.setErrors({ [validationError.type]: true });
      this.errorMsg = validationError.message;
      return;
    }

    this.form.patchValue({ [field]: file });
    this.form.get(field)?.updateValueAndValidity();
  }

  private validateFile(file: File): { type: string; message: string } | null {
    if (!this.allowedTypes.includes(file.type)) {
      return {
        type: 'invalidType',
        message: 'Invalid file type. Allowed types: JPEG, PNG, PDF',
      };
    }

    if (file.size > this.maxFileSizeMB * 1024 * 1024) {
      return {
        type: 'invalidSize',
        message: `File size exceeds ${this.maxFileSizeMB}MB limit`,
      };
    }

    return null;
  }

  getFileError(field: string): string {
    const control = this.form.get(field);
    if (!control?.errors) return '';

    if (control.hasError('required')) return 'This file is required';
    if (control.hasError('invalidType')) return 'Invalid file type';
    if (control.hasError('invalidSize')) return 'File too large';

    return '';
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('NationalID', this.form.value.NationalID);
    formData.append(
      'NationalIDImageFrontURL',
      this.form.value.NationalIDImageFrontURL
    );
    formData.append(
      'NationalIDImageBackURL',
      this.form.value.NationalIDImageBackURL
    );
    formData.append('ProfilePictureURL', this.form.value.ProfilePictureURL);

    this.loading = true;
    this.uploadProgress = 0;
    this.errorMsg = undefined;

    this.svc.upgradeToBusinessOwner(formData).subscribe({
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
