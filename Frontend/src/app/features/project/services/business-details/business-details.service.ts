import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment.development';
import { AuthService } from '../../../../core/services/auth/auth.service';

export interface Project {
  id: number;
  projectTitle: string;
  subtitle: string;
  projectLocation: string;
  projectImageUrl: string;
  fundingGoal: number;
  fundingExchange: string;
  status: string;
  projectVision: string;
  projectStory: string;
  currentVision: string;
  goals: string;
  categoryName: string;
  ownerId: string;
}

export interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  profilePictureURL: string;
}

export interface FullProjectPayload {
  project: Project;
  owner:   UserDetails;
}

@Injectable({
  providedIn: 'root'
})
export class BusinessDetailsService {
  private projectUrl = `${environment.projectUrl}`;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getFullProjectDetails(projectId: string): Observable<{ project: Project, owner: UserDetails }> {
    return this.http.get<Project>(`${this.projectUrl}/${projectId}`).pipe(
      switchMap(project => 
        this.authService.getUserById(project.ownerId).pipe(
          switchMap(owner => 
            of({ project, owner })
          )
        )
      ),
      catchError(error => {
        console.error('Error loading project details:', error);
        return throwError(() => new Error('Failed to load project details'));
      })
    );
  }
}