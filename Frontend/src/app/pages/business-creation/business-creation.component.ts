import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BusinessCreationService } from '../../features/project/services/business-creation/business-creation.service';
import { AutoFocusDirective } from '../../shared/directives/auto-focus/auto-focus.directive';
import { AuthService } from '../../core/services/auth/auth.service';
import { ICategory } from '../../features/project/interfaces/icategory';
import { CategoryService } from '../../features/project/services/category/category.service';
import { IBusiness } from '../../features/project/interfaces/IBusiness';
import { take } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
export function imageFileValidator(maxSize: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value as File | null;
    if (!file) {
      return null;
    }
    if (!(file instanceof File)) {
      return { invalidFile: true };
    }
    if (!file.type.startsWith('image/')) {
      return { fileType: true };
    }
    if (file.size > maxSize) {
      return { fileSize: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-business-creation',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AutoFocusDirective,
    MatIconModule,
  ],
  templateUrl: './business-creation.component.html',
  styleUrls: ['./business-creation.component.css'],
})
export class BusinessCreationComponent implements OnInit {
  // FormBuilder to construct reactive form controls
  private fb = inject(FormBuilder);
  // AuthService to retrieve current logged-in user data
  private authService = inject(AuthService);

  // File object for the selected image
  businessImageFile: File | null = null;
  articlesOfAssociationFile: File | null = null;
  commercialRegistryFile: File | null = null;
  taxCardFile: File | null = null;

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

  blockMessage = '';
  navigationPath: string[] = ['/'];
  navigationButtonText = 'Go home';
  isChecking = true;

  constructor(
    private businessCreationService: BusinessCreationService,
    public categoryService: CategoryService,
    public router: Router
  ) {
    // Initialize form with validators
    this.businessForm = this.fb.group({
      ProjectTitle: ['', [Validators.required, Validators.minLength(5)]],
      Subtitle: ['', [Validators.required, Validators.maxLength(150)]],
      ProjectLocation: ['', Validators.required],
      FundingGoal: [0, [Validators.required, Validators.min(10000)]],
      FundingExchange: ['', [Validators.required]],
      ProjectVision: ['', [Validators.required, Validators.minLength(100)]],
      ProjectStory: ['', [Validators.required, Validators.minLength(200)]],
      CurrentVision: ['', Validators.required],
      Goals: ['', Validators.required],
      CategoryId: [0, [Validators.required, Validators.min(1)]],
      ProjectImage: [null, [Validators.required, imageFileValidator(MAX_FILE_SIZE)]],
      ArticlesOfAssociation: [null, [Validators.required, imageFileValidator(MAX_FILE_SIZE)]],
      CommercialRegistryCertificate: [null, [Validators.required, imageFileValidator(MAX_FILE_SIZE)]],
      TextCard: [null, [Validators.required, imageFileValidator(MAX_FILE_SIZE)]],
    });
  }

  ngOnInit() {
    this.loadCategories();

    this.authService.user$.pipe(take(1)).subscribe((user) => {
      // 1) Not a BusinessOwner?
      if (!user || user.role !== 'BusinessOwner') {
        this.blockAccess(
          'Only Business Owners can create projects',
          ['/'],
          'Return home'
        );
        this.isChecking = false;
        return;
      }

      this.ownerId = user.id;

      // 2) Check for existing project
      this.businessCreationService
        .getProjectsForCurrentUser()
        .pipe(take(1))
        .subscribe({
          next: (resp) => {
            if (
              resp.isValid &&
              resp.data &&
              resp.data.ownerId === this.ownerId
            ) {
              this.blockAccess(
                'You already have a project!',
                ['/BusinessDashboard'],
                'Go to Dashboard'
              );
            }
            this.isChecking = false;
          },
          error: (err) => {
            console.error('Error fetching projects:', err);
            this.blockAccess(
              'Error verifying existing projects',
              ['/'],
              'Try again later'
            );
            this.isChecking = false;
          },
        });
    });
  }

  /**
   * Fetches project categories from server and enables the category dropdown
   */
  private loadCategories() {
    this.isLoadingCategories = true;
    this.errorMessage = '';

    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        this.isLoadingCategories = false;
        this.businessForm.get('CategoryId')?.enable();
      },
      error: (err) => {
        this.errorMessage =
          'Failed to load categories. Please try again later.';
        this.isLoadingCategories = false;
        console.error('Error loading categories:', err);
      },
    });
  }

  private blockAccess(message: string, path: string[], buttonText = 'Go home') {
    this.blockMessage = message;
    this.navigationPath = path;
    this.navigationButtonText = buttonText;
    this.businessForm.disable();
  }

  /**
   * Handles file input change event to capture the selected image
   */

  onFileSelected(
    event: Event,
    formControlName: string,
    fileFieldName: string
  ): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.businessForm.patchValue({ [formControlName]: file });
      (this as any)[fileFieldName] = file;
    } else {
      this.businessForm.patchValue({ [formControlName]: '' });
      (this as any)[fileFieldName] = null;
    }
    this.businessForm.get(formControlName)?.updateValueAndValidity();
    const ctrl = this.businessForm.get(formControlName)!;
    ctrl.markAsTouched();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.businessImageFile = file;
  
    const ctrl = this.businessForm.get('ProjectImage')!;
    ctrl.setValue(file);
    ctrl.markAsTouched();
    ctrl.updateValueAndValidity();
  }  

  onAssertionSelected(event: Event) {
    this.onFileSelected(
      event,
      'ArticlesOfAssociation',
      'articlesOfAssociationFile'
    );
  }

  onComercialSelected(event: Event) {
    this.onFileSelected(
      event,
      'CommercialRegistryCertificate',
      'commercialRegistryFile'
    );
  }

  onTaxCardSelected(event: Event) {
    this.onFileSelected(
      event, 
      'TextCard', 
      'taxCardFile'
    );
  }

  /**
   * Validates form, constructs FormData payload (including ownerId), and posts to API
   */
  onSubmit() {
    this.formSubmitted = true;
    this.businessForm.markAllAsTouched();

    if (this.businessForm.invalid) { 
      return;
    }

    this.isLoading = true;

    const formValues = this.businessForm.value;

    const biz: IBusiness = {
      projectTitle: formValues.ProjectTitle,
      subtitle: formValues.Subtitle,
      projectLocation: formValues.ProjectLocation,
      fundingGoal: formValues.FundingGoal,
      projectImage: formValues.ProjectImage,
      articlesOfAssociation: formValues.ArticlesOfAssociation,
      commercialRegistryCertificate: formValues.CommercialRegistryCertificate,
      textCard: formValues.TextCard,
      fundingExchange: formValues.FundingExchange,
      projectVision: formValues.ProjectVision,
      projectStory: formValues.ProjectStory,
      currentVision: formValues.CurrentVision,
      goals: formValues.Goals,
      categoryId: formValues.CategoryId,
      ownerId: this.ownerId!,
    };

    this.businessCreationService.createProject(biz).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.router.navigate(['/BusinessDashboard']);
        } else {
          this.errorMessage = response.errorMessage || 'Creation failed';
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Project creation failed', err);
        this.errorMessage = 'Server error, please try again later.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Returns current length of project vision text for UI feedback
   */
  get visionLength() {
    return this.businessForm.controls['ProjectVision'].value.length;
  }

  /**
   * Returns current length of project story text for UI feedback
   */
  get storyLength() {
    return this.businessForm.controls['ProjectStory'].value.length;
  }
}
