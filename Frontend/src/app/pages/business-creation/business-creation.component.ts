import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BusinessCreationService } from '../../features/project/services/business-creation/business-creation.service';
import { AutoFocusDirective } from '../../shared/directives/auto-focus/auto-focus.directive';
import { AuthService } from '../../core/services/auth/auth.service';
import { ICategory } from '../../features/project/interfaces/icategory';
import { CategoryService } from '../../features/project/services/category/category.service';
import { IBusiness } from '../../features/project/interfaces/IBusiness';
import { take } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

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
  articalOfAssociationFile: File | null = null;
  commercialRegistrationFile: File | null = null;
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
      projectTitle: ['', [Validators.required, Validators.minLength(5)]],
      subtitle: ['', [Validators.required, Validators.maxLength(150)]],
      projectLocation: ['', Validators.required],
      fundingGoal: [0, [Validators.required, Validators.min(10000)]],
      projectImage: [null, [Validators.required]],
      articlesOfAssociation: [null, [Validators.required]],
      commercialRegistryCertificate: [null, [Validators.required]],
      taxCard: [null, [Validators.required]],
      fundingExchange: ['', [Validators.required]],
      projectVision: ['', [Validators.required, Validators.minLength(100)]],
      projectStory: ['', [Validators.required, Validators.minLength(200)]],
      currentVision: ['', Validators.required],
      goals: ['', Validators.required],
      categoryId: [0, [Validators.required, Validators.min(1)]],
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
        this.businessForm.get('categoryId')?.enable();
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
      this.businessForm.patchValue({ [fileFieldName]: file });
      this.businessForm.get(formControlName)?.updateValueAndValidity();
      (this as any)[fileFieldName] = file;
    }
  }

  onImageSelected(event: Event) {
    this.onFileSelected(event, 'projectImage', 'businessImageFile');
  }

  onAssertionSelected(event: Event) {
    this.onFileSelected(
      event,
      'articlesOfAssociation',
      'articalOfAssociationFile'
    );
  }

  onComercialSelected(event: Event) {
    this.onFileSelected(
      event,
      'commercialRegistryCertificate',
      'commercialRegistrationFile'
    );
  }

  onTaxCardSelected(event: Event) {
    this.onFileSelected(event, 'taxCard', 'taxCardFile');
  }

  /**
   * Validates form, constructs FormData payload (including ownerId), and posts to API
   */
  onSubmit() {
    this.formSubmitted = true;
    this.businessForm.markAllAsTouched();

    if (
      this.businessForm.invalid ||
      !this.businessImageFile ||
      !this.articalOfAssociationFile ||
      !this.commercialRegistrationFile ||
      !this.taxCardFile
    ) {
      return;
    }

    this.isLoading = true;

    const formValues = this.businessForm.value;

    const biz: IBusiness = {
      ...formValues,
      ownerId: this.ownerId!,
    };

    // Fire & forget via your new service method
    this.businessCreationService.createProject(biz).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/BusinessDashboard']);
        this.businessForm.reset();
      },
      error: (err) => {
        console.error('Create failed', err);
        this.isLoading = false;
      },
    });
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
