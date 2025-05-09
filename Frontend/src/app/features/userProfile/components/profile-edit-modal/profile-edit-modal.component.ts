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
      let initialValue = this.initialData?.[field.key] || '';
  
      // Convert date to ISO format
      if (field.type === 'date' && initialValue) {
        initialValue = new Date(initialValue).toISOString().split('T')[0];
      }
  
      // Initialize validators array
      const validators = [];
      
      if (field.required) {
        validators.push(Validators.required);
      }
  
      // Add field-specific validators
      switch(field.key) {
        case 'firstName':
        case 'lastName':
          validators.push(
            Validators.minLength(2), 
            Validators.maxLength(50)
          );
          break;
        case 'phoneNumber':
          validators.push(Validators.pattern(/^\+?[0-9]{7,15}$/));
          break;
        case 'birthDate':
          validators.push(this.validateBirthDate);
          break;
        case 'address':
          validators.push(
            Validators.minLength(5),
            Validators.maxLength(200)
          );
          break;
        case 'bio':
          validators.push(Validators.maxLength(500));
          break;
      }
  
      // Create form control with initial value and validators
      group[field.key] = [initialValue, validators];
    });

    this.profileForm = this.fb.group(group);

    // Add birthDate validator if exists
    if (this.profileForm.get('birthDate')) {
      this.profileForm.get('birthDate')?.addValidators(this.validateBirthDate);
    }
  }

  onSubmit() {
    this.formSubmitted = true;
    
    Object.values(this.profileForm.controls).forEach(control => {
      control.markAsTouched();
    });
  
    if (this.profileForm.invalid) {
      console.log('Form invalid, cannot submit');
      return;
    }
  
    const formValue = {
      ...this.profileForm.value,
      birthDate: new Date(this.profileForm.value.birthDate).toISOString()
    };
  
    this.save.emit(formValue as UpdateProfileDto);
  }
  
  private getFieldErrors(): { [key: string]: any } {
    return Object.fromEntries(
      Object.keys(this.profileForm.controls).map(key => [
        key, 
        this.profileForm.get(key)?.errors
      ])
    );
  }

  private validateBirthDate(control: AbstractControl) {
    const value = control.value;
    if (!value) return { required: true };
    
    // Handle both date formats
    const dateValue = new Date(value);
    if (isNaN(dateValue.getTime())) return { invalidDate: true };
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize comparison
    
    // Compare dates without time components
    const compareDate = new Date(dateValue);
    compareDate.setHours(0, 0, 0, 0);
    
    if (compareDate > today) return { futureDate: true };
    return null;
  }

  getErrorMessage(key: string): string | null {
    const control = this.profileForm.get(key);
    if (!control || !control.errors) return null;
  
    if (control.errors['required']) return 'This field is required.';
    if (control.errors['minlength']) 
      return `Minimum ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['maxlength'])
      return `Maximum ${control.errors['maxlength'].requiredLength} characters`;
    if (control.errors['pattern']) {
      if (key === 'phoneNumber') return 'Invalid phone format (e.g. +1234567890)';
      return 'Invalid format';
    }
    if (control.errors['invalidDate']) return 'Invalid date format';
    if (control.errors['futureDate']) return 'Date cannot be in the future';
    
    return 'Invalid value';
  }

  get loading(): boolean {
    return this.saveStatus === 'loading';
  }  
}