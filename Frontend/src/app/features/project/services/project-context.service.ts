import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from './business-details/business-details.service';

@Injectable({ 
  providedIn: 'root'
})
export class ProjectContextService {
  private project$$ = new BehaviorSubject<Project | null>(null);
  readonly project$ = this.project$$.asObservable();

  setProject(p: Project) {
    this.project$$.next(p);
  }
}
