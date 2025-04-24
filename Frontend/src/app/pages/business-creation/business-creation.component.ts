import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule} from 'lucide-angular';
import { BusinessCreationService } from '../../features/project/services/business-creation/business-creation.service';
import { IBusinessCreation } from '../../features/project/interfaces/IBusinessCreation';
import { CategoryService, Category  } from '../../core/services/category/category.service';
import { AutoFocusDirective } from '../../shared/directives/auto-focus/auto-focus.directive';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-business-creation',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule, AutoFocusDirective],
  templateUrl: './business-creation.component.html',
  styleUrls: ['./business-creation.component.css']
})
export class BusinessCreationComponent implements OnInit {
  private fb = inject(FormBuilder);
  businessImageFile: File | null = null;
  formSubmitted = false;
  isLoading = false;

  categories: Category[] = [];
  isLoadingCategories = false;
  errorMessage = '';

  businessForm: FormGroup;
  ownerId: string | null = null;

  constructor(private businessCreationService: BusinessCreationService, public categoryService: CategoryService, public router: Router, private authService: AuthService) {
    this.businessForm = this.fb.group({
      projectTitle: ['', [Validators.required, Validators.minLength(5)]],
      subtitle: ['', [Validators.required, Validators.maxLength(150)]],
      projectLocation: ['', Validators.required],
      fundingGoal: [0, [Validators.required, Validators.min(10000)]],
      projectImage: [null, [Validators.required]],
      fundingExchange: ['', [Validators.required]],
      projectVision: ['', [Validators.required, Validators.minLength(100)]],
      projectStory: ['', [Validators.required, Validators.minLength(200)]],
      currentVision: ['', Validators.required],
      goals: ['', Validators.required],
      categoryId: [0, [Validators.required, Validators.min(1)]]
    });
  }  

  ngOnInit() {
    this.loadCategories();
    this.setOwnerId();
  }

  private loadCategories() {
    this.isLoadingCategories = true;
    this.errorMessage = '';
    
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoadingCategories = false;

        this.businessForm.get('categoryId')?.enable();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load categories. Please try again later.';
        this.isLoadingCategories = false;
        console.error('Error loading categories:', err);
      }
    });
  }

  private setOwnerId() {
    this.ownerId = localStorage.getItem('ownerId');
  }
  
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      this.businessForm.patchValue({ projectImage: file });
      this.businessForm.get('projectImage')?.updateValueAndValidity();
      this.businessImageFile = file;
    }
  }

  onSubmit() {
    this.formSubmitted = true;
    
    Object.values(this.businessForm.controls).forEach(c => c.markAsTouched());
    
    if (this.businessForm.invalid || !this.businessImageFile) {
      return;
    }
    
    this.isLoading = true;
    const formValues: IBusinessCreation = this.businessForm.value;
    
    const formData = new FormData();
    formData.append('projectImage', this.businessImageFile, this.businessImageFile.name);
    
    formData.append('projectTitle', formValues.projectTitle);
    formData.append('subtitle', formValues.subtitle);
    formData.append('projectLocation', formValues.projectLocation);
    formData.append('fundingGoal', formValues.fundingGoal.toString());
    formData.append('fundingExchange', formValues.fundingExchange);
    formData.append('projectVision', formValues.projectVision);
    formData.append('projectStory', formValues.projectStory);
    formData.append('currentVision', formValues.currentVision);
    formData.append('goals', formValues.goals);
    formData.append('categoryId', formValues.categoryId.toString());
    if (this.ownerId) {
      formData.append('ownerId', this.ownerId.toString());
    }

    // —— DEBUG: print out exactly what you’re sending ——
    for (const [key, val] of formData.entries()) {
      // File prints as a File object, everything else is a string
      console.log(key, val);
    }
    
    /*// for test
    const values = this.businessForm.getRawValue();
    // for test
    const payload = {
      ...formValues,
      categoryId: Number(formValues.categoryId),
    };*/

    this.businessCreationService.postBusinessCreation(formData).subscribe({
      next: (response) => {
        console.log('Business profile created successfully', response);
        this.isLoading = false;
        this.router.navigate(['/ProjectDetails']);
        this.businessForm.reset();
      },
      error: (error) => {
        console.error('Error creating profile', error);
        this.isLoading = false;
      }
    });
    //for test
    /*this.businessCreationService.postBusinessJSON(payload).subscribe({
      next: () => {
        console.log('Created successfully');
        this.isLoading = false;
        this.router.navigate(['/ProjectDetails']);
        this.businessForm.reset();
      },
      error: err => {
        console.error('Creation error', err);
        this.isLoading = false;
      }
    });*/
  }

  // helper methods
  get visionLength() {
    return this.businessForm.controls['projectVision'].value.length;
  }

  get storyLength() {
    return this.businessForm.controls['projectStory'].value.length;
  }
}
