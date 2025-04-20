import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

const fileValidator = (allowedTypes: string[], maxSize: number) => {
  return (control: any) => {
    const file = control.value;
    if (!file) return { required: true };
    
    if (file instanceof File) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(`.${extension}`)) {
        return { fileType: true };
      }
      
      if (file.size > maxSize) {
        return { fileSize: true };
      }
    }
    
    return null;
  };
};

@Component({
  selector: 'app-identity-verification',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './identity-verification.component.html',
  styleUrls: ['./identity-verification.component.css']
})
export class IdentityVerificationComponent implements OnInit {
  @ViewChild('frontFileInput') frontFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('backFileInput') backFileInput!: ElementRef<HTMLInputElement>;
  
  @Input() selectedRole!: 'investor' | 'business' | 'guest';
  @Output() submitted = new EventEmitter<any>();

  verificationForm!: FormGroup;
  isLoading = false;
  formSubmitted = false;

  uploadMessage: string = '';
  uploadSuccess: boolean = false;
  fileUploadProgress: number = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    const fileValidators = [
      Validators.required,
      fileValidator(['.jpg', '.jpeg', '.png', '.pdf'], 5 * 1024 * 1024)
    ];

    const baseControls = {
      idFront: [null, fileValidators],
      idBack: [null, fileValidators]
    };

    this.verificationForm = this.fb.group({
      ...baseControls,
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    this.uploadMessage = '';

    if (this.verificationForm.invalid) {
      this.uploadMessage = 'Please fix the errors in the form';
      this.uploadSuccess = false;
      return;
    }

    this.isLoading = true;
    this.fileUploadProgress = 0;
    
    // Simulate upload progress
    const interval = setInterval(() => {
      this.fileUploadProgress += Math.floor(Math.random() * 20) + 10;
      if (this.fileUploadProgress >= 100) clearInterval(interval);
    }, 200);

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.fileUploadProgress = 0;
      
      if (Math.random() < 0.9) { // 90% success rate simulation
        this.uploadSuccess = true;
        this.uploadMessage = 'Files uploaded successfully!';
        this.submitted.emit({
          role: this.selectedRole,
          formData: this.verificationForm.value
        });
      } else {
        this.uploadSuccess = false;
        this.uploadMessage = 'Upload failed. Please try again.';
      }
    }, 3000);
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.verificationForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.formSubmitted));
  }


  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    const control = this.verificationForm.get(controlName);
    
    if (file) {
      control?.setValue(file);
      control?.markAsTouched();
    } else {
      control?.setValue(null);
    }
    control?.updateValueAndValidity();
    this.uploadMessage = '';
  }

  getErrorMessage(control: AbstractControl | null): string {
    if (!control?.errors) return '';
    
    if (control.hasError('required')) {
      return 'This field is required';
    }
    if (control.hasError('fileType')) {
      return 'Invalid file type (JPEG, PNG, PDF only)';
    }
    if (control.hasError('fileSize')) {
      return 'File too large (max 5MB)';
    }
    return 'Invalid value';
  }
}
