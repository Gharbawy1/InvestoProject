import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateProfileDto } from '../../interfaces/UpdateProfile';

@Component({
  selector: 'app-profile-edit-modal',
  imports: [CommonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './profile-edit-modal.component.html',
  styleUrls: ['./profile-edit-modal.component.css']
})
export class ProfileEditModalComponent {
  @Input() initialData!: any;
  @Input() modalTitle!: string;
  @Input() saveStatus!: 'loading'|'error'|'success'|null;

  @Output() save   = new EventEmitter<UpdateProfileDto>();
  @Output() cancel = new EventEmitter<void>();

  formSubmitted = false;
  profileForm!: FormGroup;

  errorMessage?: string;

  constructor(private fb: FormBuilder) {}

  @Input() fields = [
    {
      key: 'firstName',
      label: 'First Name',
      required: true,
      type: 'text',
      minLength: 2,
      maxLength: 50
    },
    {
      key: 'lastName',
      label: 'Last Name',
      required: true,
      type: 'text',
      minLength: 2,
      maxLength: 50
    },
    {
      key: 'phoneNumber',
      label: 'Phone Number',
      required: true,
      type: 'tel',
      pattern: /^\+?[0-9]{7,15}$/
    },
    {
      key: 'birthDate',
      label: 'Birth Date',
      required: true,
      type: 'date'
    },
    {
      key: 'bio',
      label: 'Bio',
      required: false,
      type: 'text',
      maxLength: 500
    },
    {
      key: 'address',
      label: 'Address',
      required: true,
      type: 'text',
      minLength: 5,
      maxLength: 200
    }
  ];

  ngOnInit() {
    const group: any = {};
  this.fields.forEach(field => {
    const validators = [];
    if (field.required) validators.push(Validators.required);
    
    // Add type-specific validators
    switch(field.key) {
      case 'firstName':
      case 'lastName':
        validators.push(Validators.minLength(2), Validators.maxLength(50));
        break;
      case 'phoneNumber':
        validators.push(Validators.pattern(/^\+?[0-9]{7,15}$/));
        break;
      case 'birthDate':
        validators.push(this.validateBirthDate);
        break;
      case 'address':
        validators.push(Validators.minLength(5), Validators.maxLength(200));
        break;
      case 'bio':
        validators.push(Validators.maxLength(500));
        break;
    }
    
    group[field.key] = [this.initialData?.[field.key] || '', validators];
  });

  this.profileForm = this.fb.group(group);

  // Add birthDate validator if exists
  if (this.profileForm.get('birthDate')) {
    this.profileForm.get('birthDate')?.addValidators(this.validateBirthDate);
  }

    if (this.initialData) {
      this.profileForm.patchValue(this.initialData);
    } else {
      this.profileForm.reset();
    }
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.profileForm.invalid) return;

    this.save.emit(this.profileForm.value as UpdateProfileDto);
  }

  private validateBirthDate(control: AbstractControl) {
    const dateValue = new Date(control.value);
    const today = new Date();
    if (isNaN(dateValue.getTime())) return { invalidDate: true };

    if (dateValue > today) return { futureDate: true };

    return null;
  }

  getErrorMessage(key: string): string | null {
    const control = this.profileForm.get(key);
    if (!control || !control.errors) return null;
  
    if (control.errors['required']) return 'This field is required.';
    if (control.errors['minlength'])
      return `Minimum ${control.errors['minlength'].requiredLength} characters required.`;
    if (control.errors['maxlength'])
      return `Maximum ${control.errors['maxlength'].requiredLength} characters allowed.`;
    if (control.errors['pattern']) return 'Invalid format.';
    if (control.errors['invalidDate']) return 'Invalid date.';
    if (control.errors['futureDate']) return 'Birth date cannot be in the future.';
  
    return 'Invalid value.';
  }  

  get loading(): boolean {
    return this.saveStatus === 'loading';
  }  
}