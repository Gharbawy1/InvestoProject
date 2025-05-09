import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/componentes/button/button.component';
import { ICategory } from '../../interfaces/icategory';

@Component({
  selector: 'app-project-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './project-filter.component.html',
  styleUrl: './project-filter.component.css',
})
export class ProjectFilterComponent {
  @Input() categories: ICategory[] = [];
  @Output() filterChange = new EventEmitter<{
    searchTerm: string;
    categoryName: string;
    sortOrder: 'default' | 'funding' | 'recent';
  }>();

  searchTerm: string = '';
  activeCategoryName = 'All Projects';
  sortOrder: 'default' | 'funding' | 'recent' = 'default';

  private emitFilterChange(): void {
    this.filterChange.emit({
      searchTerm: this.searchTerm,
      categoryName: this.activeCategoryName,
      sortOrder: this.sortOrder,
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.emitFilterChange();
  }

  setCategory(categoryName: string): void {
    this.activeCategoryName = categoryName;
    this.emitFilterChange();
  }

  changeSortOrder(): void {
    this.sortOrder =
      this.sortOrder === 'default'
        ? 'funding'
        : this.sortOrder === 'funding'
        ? 'recent'
        : 'default';

    this.emitFilterChange();
  }
}
