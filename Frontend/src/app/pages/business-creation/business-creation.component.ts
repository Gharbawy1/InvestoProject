import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule} from 'lucide-angular';
import { BusinessCreationService } from '../../features/project/services/business-creation/business-creation.service';
import { AutoFocusDirective } from '../../shared/directives/auto-focus/auto-focus.directive';
import { AuthService, User } from '../../core/services/auth/auth.service';
import { ICategory } from '../../features/project/interfaces/icategory';
import { CategoryService } from '../../features/project/services/category/category.service';
import { IBusiness } from '../../features/project/interfaces/IBusiness';

@Component({
  selector: 'app-business-creation',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule, AutoFocusDirective],
  templateUrl: './business-creation.component.html',
  styleUrls: ['./business-creation.component.css']
})
export class BusinessCreationComponent implements OnInit {
  // FormBuilder to construct reactive form controls
  private fb = inject(FormBuilder);
  // AuthService to retrieve current logged-in user data
  private authService = inject(AuthService);

  // File object for the selected project image
  businessImageFile: File | null = null;
  // Flag to detect if form has been submitted (for displaying validation messages)
  formSubmitted = false;
  // Loading state for form submission
  isLoading = false;

  categories: ICategory[] = [];

  isLoadingCategories = false;
  errorMessage = '';

  // Reactive form group for business profile fields
  businessForm: FormGroup;
  // Owner ID of the project, set to the currently logged-in user's ID
  ownerId: string | null = null;

  constructor(private businessCreationService: BusinessCreationService, public categoryService: CategoryService, public router: Router) {
    // Initialize form with validators
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
    // Load categories for selection
    this.loadCategories();
    // Subscribe to AuthService to get and keep track of the logged-in user's ID
    this.authService.user$.subscribe((user: User | null) => {
      this.ownerId = user ? user.id : null;
    });
  }

  /**
   * Fetches project categories from server and enables the category dropdown
   */
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
  
  /**
   * Handles file input change event to capture the selected image
   */
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      this.businessForm.patchValue({ projectImage: file });
      this.businessForm.get('projectImage')?.updateValueAndValidity();
      this.businessImageFile = file;
    }
  }

  /**
   * Validates form, constructs FormData payload (including ownerId), and posts to API
   */
  onSubmit() {
    this.formSubmitted = true;
    Object.values(this.businessForm.controls).forEach(c => c.markAsTouched());
    
    if (this.businessForm.invalid || !this.businessImageFile) {
      return;
    }
    
    this.isLoading = true;
    const formValues: IBusiness = this.businessForm.value;
    
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
    formData.append('status', 'pending');
    formData.append('submissionDate', new Date().toISOString());
    formData.append('categoryId', formValues.categoryId.toString());
    // Append the ID of the current user as the project owner
    if (this.ownerId !== null) {
      formData.append('ownerId', this.ownerId.toString());
    }

    // Debug: log all key/value pairs
    for (const [key, val] of formData.entries()) {
      console.log(key, val);
    }
    
    /*// for test
    const values = this.businessForm.getRawValue();
    // for test
    const payload = {
      ...formValues,
      categoryId: Number(formValues.categoryId),
    };*/

    // Send creation request
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

  /**
   * Returns current length of project vision text for UI feedback
   */
  get visionLength() {
    return this.businessForm.controls['projectVision'].value.length;
  }

  /**
   * Returns current length of project story text for UI feedback
   */
  get storyLength() {
    return this.businessForm.controls['projectStory'].value.length;
  }
}