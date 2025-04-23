import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/componentes/button/button.component';
import { InputComponent } from '../../../../shared/componentes/input/input.component';
import { ICategory } from '../../interfaces/icategory';


@Component({
  selector: 'app-project-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputComponent], 
  templateUrl: './project-filter.component.html',
  styleUrl: './project-filter.component.css'
})
export class ProjectFilterComponent {
  @Input() categories: ICategory[] = [];
  @Output() filterChange = new EventEmitter<{searchTerm: string, categoryId: number, sortOrder: string}>();

  searchTerm = signal('');
  activeCategoryId = 0; 
  sortOrder = signal<'default' | 'funding' | 'recent'>('default');

  // Combined filter changes
  private emitFilterChange() {
    this.filterChange.emit({
      searchTerm: this.searchTerm(),
      categoryId: this.activeCategoryId,
      sortOrder: this.sortOrder()
    });
  }

  changeSortOrder(): void {
    this.sortOrder.set(
      this.sortOrder() === 'default'
        ? 'funding'
        : this.sortOrder() === 'funding'
        ? 'recent'
        : 'default'
    );
    this.emitFilterChange();
  }
  
  setCategory(categoryId: number): void {
    this.activeCategoryId = categoryId;
    this.emitFilterChange();
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.emitFilterChange();
  }
}