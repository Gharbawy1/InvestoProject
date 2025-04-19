import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Building2, Upload, FileText } from 'lucide-angular';
import { ButtonComponent } from "../../shared/componentes/button/button.component";

@Component({
  selector: 'app-business-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule, ButtonComponent],
  templateUrl: './business-creation.component.html',
  styleUrls: ['./business-creation.component.css']
})
export class BusinessCreationComponent {
  private fb = inject(FormBuilder);
  businessRegistrationFile: File | null = null;
  financialStatementsFile: File | null = null;
  
  
  businessForm = this.fb.group({
    businessName: ['', [Validators.required, Validators.minLength(2)]],
    businessType: ['', Validators.required],
    registrationNumber: ['', Validators.required],
    foundedYear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
    website: ['', Validators.pattern(/^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w\-.~]*)*\/?$/)],
    description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
    industry: ['', Validators.required],
    employeeCount: ['', Validators.required],
    contactEmail: ['', [Validators.required, Validators.email]],
    contactPhone: ['', [Validators.required, Validators.pattern(/^\d{10,}$/)]]
  });

  businessTypes = [
    { value: 'startup', label: 'Startup' },
    { value: 'small_business', label: 'Small Business' },
    { value: 'corporation', label: 'Corporation' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'nonprofit', label: 'Non-profit' },
    { value: 'sole_proprietorship', label: 'Sole Proprietorship' }
  ];

  industries = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'energy', label: 'Energy' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'other', label: 'Other' }
  ];

  employeeCounts = [
    { value: '1-10', label: '1-10' },
    { value: '11-50', label: '11-50' },
    { value: '51-200', label: '51-200' },
    { value: '201-500', label: '201-500' },
    { value: '501-1000', label: '501-1000' },
    { value: '1000+', label: '1000+' }
  ];
  
  
  onFileSelected(event: Event, type: 'registration' | 'financial') {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
  
    if (file) {
      if (type === 'registration') {
        this.businessRegistrationFile = file;
      } else if (type === 'financial') {
        this.financialStatementsFile = file;
      }
    }
  }
  
  onSubmit() {
    if (this.businessForm.valid) {
      const formData = new FormData();
      Object.entries(this.businessForm.value).forEach(([key, value]) => {
        if (value !== null) {
          formData.append(key, value);
        }
      });
  
      if (this.businessRegistrationFile) {
        formData.append('businessRegistration', this.businessRegistrationFile);
      }
  
      if (this.financialStatementsFile) {
        formData.append('financialStatements', this.financialStatementsFile);
      }
  
      // Submit formData to your API
      console.log('FormData ready to send:', formData);
    } else {
      this.businessForm.markAllAsTouched();
    }
  }
  

  get descriptionLength() {
    return this.businessForm.get('description')?.value?.length || 0;
  }

  // Helper for cleaner template
  hasError(controlName: string, error: string) {
    const control = this.businessForm.get(controlName);
    return control && control.hasError(error) && (control.dirty || control.touched);
  }
}
