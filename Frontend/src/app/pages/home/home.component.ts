import { Component } from '@angular/core';
import { ProjectMasterComponent } from '../../features/project/components/project-master/project-master.component';

@Component({
  selector: 'app-home',
  imports: [ProjectMasterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
