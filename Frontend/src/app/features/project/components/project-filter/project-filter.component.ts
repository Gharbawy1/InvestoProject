import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/componentes/button/button.component';
import { InputComponent } from '../../../../shared/componentes/input/input.component';

@Component({
  selector: 'app-project-filter',
  imports: [CommonModule, FormsModule, ButtonComponent, InputComponent], 
  templateUrl: './project-filter.component.html',
  styleUrl: './project-filter.component.css'
})

export class ProjectFilterComponent {
  @Input() categories: string[] = [];
  @Output() search = new EventEmitter<string>();
  @Output() categorySelect = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();

  searchTerm = signal('');
  activeCategory = signal('All Projects');
  sortOrder = signal<'default' | 'funding' | 'recent'>('default');

  changeSortOrder(): void {
    this.sortOrder.set(
      this.sortOrder() === 'default'
        ? 'funding'
        : this.sortOrder() === 'funding'
        ? 'recent'
        : 'default'
    );
    this.sortChange.emit(this.sortOrder());
  }

  setCategory(category: string): void {
    this.activeCategory.set(category);
    this.categorySelect.emit(category);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.search.emit(value);
  }
}
