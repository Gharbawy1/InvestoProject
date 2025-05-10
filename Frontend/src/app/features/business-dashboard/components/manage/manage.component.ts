import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn, ValidationErrors  } from '@angular/forms';
import { BusinessForCurrentService } from '../../services/business-for-current.service';
import { DashboardBusiness } from '../../interfaces/IDashboardBusiness'; 
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../project/services/category/category.service';
import { ICategory } from '../../../project/interfaces/icategory';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
export function imageFileValidator(maxSize: number): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    const file = ctrl.value as File | null;
    if (!file) return null; 
    if (!(file instanceof File)) return { invalidFile: true };
    if (!file.type.startsWith('image/')) return { fileType: true };
    if (file.size > maxSize) return { fileSize: true };
    return null;
  };
}

@Component({
  selector: 'app-manage',
  imports: [
    CommonModule, 
    ReactiveFormsModule,
   ],
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, OnChanges {
  @Input() projectId!: number;
  @Output() projectDeleted = new EventEmitter<number>();

  form!: FormGroup;
  project!: DashboardBusiness;
  loading = false;

  categories: ICategory[] = [];
  isLoadingCategories = false;

  formSubmitted = false;

  notificationMsg  = '';
  notificationType: 'success' | 'error' = 'success';
  showDeleteModal = false;

  showUpdateModal = false;

  constructor(
    private fb: FormBuilder,
    private service: BusinessForCurrentService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.buildForm();
    this.loadAllData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['projectId'] && this.projectId) {
      this.loadAllData();
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      projectTitle: ['', Validators.required],
      subtitle: [''],
      projectLocation: [''],
      fundingGoal: [null, Validators.required],
      fundingExchange: [''],
      projectVision: [''],
      projectStory: [''],
      currentVision: [''],
      goals: [''],
      categoryId: [null, Validators.required],
      projectImage: [null, [imageFileValidator(MAX_FILE_SIZE)]],
      articlesOfAssociation: [null, [imageFileValidator(MAX_FILE_SIZE)]],
      commercialRegistryCertificate: [null, [imageFileValidator(MAX_FILE_SIZE)]],
      taxCard: [null, [imageFileValidator(MAX_FILE_SIZE)]],
    });
  }

  private loadAllData() {
    this.isLoadingCategories = true;
    this.formSubmitted = false;

    forkJoin({
      categories: this.categoryService.getCategories(),
      project: this.service.getProjectsForCurrentUser()
    }).subscribe({
      next: ({categories, project}) => {
        this.categories = categories.data;
        
        if (project.data) {
          this.project = project.data;

          const matched = this.categories.find(
            c => c.name === this.project.categoryName
          )?.id ?? null;

          console.log('raw project:', this.project);
          this.form.patchValue({
            projectTitle: this.project.projectTitle,
            subtitle: this.project.subtitle,
            projectLocation: this.project.projectLocation,
            fundingGoal: this.project.fundingGoal,
            fundingExchange: this.project.fundingExchange,
            projectVision: this.project.projectVision,
            projectStory: this.project.projectStory,
            currentVision: this.project.currentVision,
            goals: this.project.goals,
            categoryId: matched
          });
        }
        console.log('categoryId after patch:', this.form.value.categoryId);
        console.log('all categories:', this.categories);
        this.isLoadingCategories = false;
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.isLoadingCategories = false;
        alert('Failed to load required data');
      }
    });
  }

  onFileSelected(event: Event, controlName: string) {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    const control = this.form.get(controlName)!;
  
    control.setValue(file);
    control.markAsTouched();
    control.updateValueAndValidity();
  }
  
  getErrorMessage(control: AbstractControl | null): string {
    if (!control?.errors) return '';
    
    if (control.errors['required']) return '* This field is required';
    if (control.errors['fileType']) return '* Only JPEG/PNG images allowed';
    if (control.errors['fileSize']) return '* File too large (max 5MB)';
    
    return '* Invalid file';
  }

  confirmUpdate() {
    this.showUpdateModal = false;
    this.loading = true;
  
    const data = new FormData();
    const userId = this.authService.getUserId();
    if (userId) {
      data.append('OwnerId', userId);
    }
  
    Object.entries(this.form.controls).forEach(([key, ctrl]) => {
      const val = ctrl.value;
      if (val === null || val === undefined || val instanceof File) return;
  
      const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
      if (['FundingGoal', 'CategoryId'].includes(fieldName)) {
        data.append(fieldName, val.toString());
      } else {
        data.append(fieldName, val);
      }
    });
  
    const fileFields = {
      projectImage: 'ProjectImage',
      articlesOfAssociation: 'ArticlesOfAssociation',
      commercialRegistryCertificate: 'CommercialRegistryCertificate',
      taxCard: 'TextCard'
    };
  
    Object.entries(fileFields).forEach(([controlName, fieldName]) => {
      const file = this.form.get(controlName)?.value;
      if (file instanceof File) {
        data.append(fieldName, file, file.name);
      }
    });
  
    this.service.updateProjectById(this.projectId, data).subscribe({
      next: (response) => {
        if (!response.isValid) {
          this.showNotification(response.errorMessage || 'Update failed', 'error');
          return;
        }
        this.showNotification('Project updated successfully', 'success');
        
        window.location.href = `/BusinessDashboard?refresh=${Date.now()}`;
      },
      error: (err) => {
        this.showNotification('Update request failed', 'error');
      }
    }).add(() => this.loading = false);
  }

  openUpdateConfirm() {
    this.formSubmitted = true;
    if (this.form.invalid) return;
    this.showUpdateModal = true;
  }

  cancelUpdate() {
    this.showUpdateModal = false;
  }

  onReset() {
    this.formSubmitted = false;
    this.form.reset();
    this.loadAllData();
  }

  openDeleteConfirm() {
    this.showDeleteModal = true;
  }
  
  cancelDelete() {
    this.showDeleteModal = false;
  }

  confirmDelete() {
    this.showDeleteModal = false;
    
    this.service.deleteProjectById(this.projectId).subscribe({
      next: () => {
        this.projectDeleted.emit(this.projectId);
        window.location.href = `/BusinessDashboard?refresh=${Date.now()}`;
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.showNotification('Delete failed. Please try again.', 'error');
      }
    });
  }

  private showNotification(msg: string, type: 'success'|'error') {
    this.notificationMsg  = msg;
    this.notificationType = type;
    setTimeout(() => (this.notificationMsg = ''), 3000);
  }
  
}
