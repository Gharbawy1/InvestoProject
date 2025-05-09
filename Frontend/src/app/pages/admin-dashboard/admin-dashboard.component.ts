import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectApprovalCardComponent } from '../../features/admin-dashboard/components/project-approval-card/project-approval-card.component';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService } from '../../features/project/services/category/category.service';
import { ICategory } from '../../features/project/interfaces/icategory';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    ProjectApprovalCardComponent,
    FormsModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  tabs = ['projects', 'users', 'settings'] as const;
  activeTab = signal<'projects' | 'users' | 'settings'>('projects');
  categories: ICategory[] = [];
  newCategory = '';
  newRole = '';
  roles: string[] = ['Admin', 'Investor', 'Business Owner', 'Guest'];
  editingCategoryId: string = '';
  updatedCategoryName: string = '';

  setActiveTab(tab: 'projects' | 'users' | 'settings') {
    this.activeTab.set(tab);
  }
  constructor(private categoryService: CategoryService) {}
  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories().subscribe((res) => {
      this.categories = res.data;
    });
  }

  addCategory(categoryName: string) {
    this.categoryService.addCategory(categoryName).subscribe((res) => {
      this.categories.push(res.data);
    });
  }

  deleteCategory(categoryId: string) {
    this.categoryService.deleteCategory(+categoryId).subscribe((res) => {
      this.categories = this.categories.filter((cat) => cat.id !== categoryId);
    });
  }

  updateCategory(categoryId: string, categoryName: string) {
    this.categoryService
      .updateCategory(+categoryId, categoryName)
      .subscribe((res) => {
        const index = this.categories.findIndex((cat) => cat.id === categoryId);
        if (index !== -1) {
          this.categories[index].name = categoryName;
        }
      });
  }

  startEditing(category: any) {
    this.editingCategoryId = category.id;
    this.updatedCategoryName = category.name;
  }

  submitUpdate(categoryId: string) {
    if (this.updatedCategoryName.trim()) {
      this.updateCategory(categoryId, this.updatedCategoryName.trim());
      this.editingCategoryId = '';
      this.updatedCategoryName = '';
    }
  }

  cancelEditing() {
    this.editingCategoryId = '';
    this.updatedCategoryName = '';
  }
}
