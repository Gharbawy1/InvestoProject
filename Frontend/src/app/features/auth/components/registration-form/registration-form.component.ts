import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration-form',
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration-form.component.html',
})
export class RegistrationFormComponent {
  step = 1;
  selectedRole: 'investor' | 'business' = 'investor';

  personalInfoForm: FormGroup;
  businessInfoForm: FormGroup;
  documentUploadForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.personalInfoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      country: ['', Validators.required],
    });

    this.businessInfoForm = this.fb.group({
      businessName: ['', [Validators.required, Validators.minLength(2)]],
      businessType: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      foundedYear: ['', [Validators.required, Validators.minLength(4)]],
      website: [''],
    });

    this.documentUploadForm = this.fb.group({
      identityProof: [null, Validators.required],
      businessRegistration: [null],
      additionalDocuments: [null],
    });
  }

  setRole(role: 'investor' | 'business') {
    this.selectedRole = role;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  submitPersonalInfo() {
    if (this.personalInfoForm.valid) {
      console.log(this.personalInfoForm.value);
      this.nextStep();
    }
  }

  submitBusinessInfo() {
    if (this.businessInfoForm.valid) {
      console.log(this.businessInfoForm.value);
      this.nextStep();
    }
  }

  submitDocuments() {
    if (this.documentUploadForm.valid) {
      console.log(this.documentUploadForm.value);
      alert('Registration Complete!');
    }
  }
}
