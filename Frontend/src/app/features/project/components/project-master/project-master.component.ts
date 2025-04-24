import { Component, OnInit } from '@angular/core';
import { ProjectFilterComponent } from '../project-filter/project-filter.component';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectCardService } from '../../services/project-card/project-card.service';
import { IProjectCard } from '../../interfaces/iprojectcard';
import { ICategory } from '../../interfaces/icategory';
import { CategoryService } from '../../services/category/category.service';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'project-master',
  standalone: true,
  imports: [ProjectFilterComponent, ProjectCardComponent, MatPaginatorModule ],
  templateUrl: './project-master.component.html',
  styleUrls: ['./project-master.component.css'], 
  providers:[ProjectCardService, CategoryService]
})
export class ProjectMasterComponent  { //implements OnInit

  allProjects: IProjectCard[] = [];
  filteredProjects: IProjectCard[] = [];
  categoriesList : ICategory[] = [];
  currentPage: number = 1;
  pageSize: number = 20; 
  
  constructor(private projectCardService: ProjectCardService, private categoriesService : CategoryService) {}

  // ngOnInit(): void {
    // this.projectCardService.getProjects().subscribe((prjctData) => {
    //   this.allProjects = prjctData;
    //   this.filteredProjects = [...prjctData]; 
    // });
    
  //   this.categoriesService.getCategories().subscribe((categories)=>{
  //     this.categoriesList = categories;
  //   });
  // }

  onFiltersChanged(filters: any) {
    this.filteredProjects = this.allProjects.filter(p => {
      return filters.category ? p.category === filters.category : true;
    });
    
    this.currentPage = 1;
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
