import { Component, OnInit } from '@angular/core';
import { ProjectFilterComponent } from '../project-filter/project-filter.component';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectCardService } from '../../services/project-card/project-card.service';
import { IProjectCard } from '../../interfaces/iprojectcard';
import { ICategory } from '../../interfaces/icategory';
import { CategoryService } from '../../services/category/category.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'project-master',
  standalone: true,
  imports: [
    CommonModule,
    ProjectFilterComponent,
    ProjectCardComponent,
    MatPaginatorModule,
  ],
  templateUrl: './project-master.component.html',
  styleUrls: ['./project-master.component.css'],
  providers: [ProjectCardService, CategoryService],
})
export class ProjectMasterComponent implements OnInit {
  allProjects: IProjectCard[] = [];
  filteredProjects: IProjectCard[] = [];
  categoriesList: ICategory[] = [];
  currentPage: number = 0;
  pageSize: number = 20;

  constructor(
    private projectCardService: ProjectCardService,
    private categoriesService: CategoryService
  ) {}

  ngOnInit(): void {
    this.projectCardService.getProjects().subscribe((response) => {
      this.allProjects = response.data;
      this.filteredProjects = [...response.data];
    });
    this.categoriesService.getCategories().subscribe({
      next: (response) => {
        this.categoriesList = response.data;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });
  }

  onFiltersChanged(filters: {
    searchTerm: string;
    categoryName: string;
    sortOrder: 'default' | 'funding' | 'recent';
  }) {
    const search = filters.searchTerm.toLowerCase();
    const category =
      filters.categoryName === 'All Projects' ? null : filters.categoryName;
    this.filteredProjects = this.allProjects
      .filter((project) => {
        const matchesSearch = project.projectTitle
          .toLowerCase()
          .includes(search);
        const matchesCategory = category
          ? project.categoryName === category
          : true;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (filters.sortOrder === 'funding') {
          return b.raisedFunds - a.raisedFunds;
        }
        // if (filters.sortOrder === 'recent') {
        //   return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // }
        return 0;
      });

    this.currentPage = 0;
  }

  getPaginatedProjects(): IProjectCard[] {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredProjects.slice(startIndex, endIndex);
  }

  // Handle page change event
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
  }
}
