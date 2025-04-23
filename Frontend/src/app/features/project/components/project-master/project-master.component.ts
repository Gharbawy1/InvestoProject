import { Component, OnInit } from '@angular/core';
import { ProjectFilterComponent } from '../project-filter/project-filter.component';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectCardService } from '../../services/project-card.service';
import { IProjectCard } from '../../interfaces/iprojectcard';
import { ICategory } from '../../interfaces/icategory';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'project-master',
  standalone: true,
  imports: [ProjectFilterComponent, ProjectCardComponent],
  templateUrl: './project-master.component.html',
  styleUrls: ['./project-master.component.css'], 
  providers:[ProjectCardService, CategoriesService]
})
export class ProjectMasterComponent  { //implements OnInit

  allProjects: IProjectCard[] = [];
  filteredProjects: IProjectCard[] = [];
  categoriesList : ICategory[] = [];
  
  constructor(private projectCardService: ProjectCardService, private categoriesService : CategoriesService) {}

  // ngOnInit(): void {
  //   this.projectCardService.getProjects().subscribe((prjctData) => {
  //     this.allProjects = prjctData;
  //     this.filteredProjects = [...prjctData]; 
  //   });
    
  //   this.categoriesService.getCategories().subscribe((categories)=>{
  //     this.categoriesList = categories;
  //   });
  // }

  onFiltersChanged(filters: any) {
    this.filteredProjects = this.allProjects.filter(p => {
      return filters.category ? p.category === filters.category : true;
    });
  }
  
  
  
}
