import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment.development';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { IBusinessDetails } from '../../interfaces/IBusinessDetails';

export interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  profilePictureURL: string;
}

export interface FullProjectPayload {
  project: IBusinessDetails;
  owner: UserDetails;
}

@Injectable({
  providedIn: 'root',
})
export class BusinessDetailsService {
  private projectUrl = `${environment.baseApi}${environment.project.getAll}`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getFullProjectDetails(
    projectId: string
  ): Observable<FullProjectPayload> {
    return this.http
      .get<{ data: IBusinessDetails }>(`${this.projectUrl}/${projectId}`)
      .pipe(
        map(response => response.data),
        switchMap(project => {
          if (!project.ownerId) {
            return throwError(() => new Error('Project has no ownerId'));
          }
          return this.authService.getUserById(project.ownerId).pipe(
            map(owner => ({ project, owner }))
          );
        }),
        catchError(err => {
          console.error('Error loading project details:', err);
          return throwError(() => new Error('Failed to load project details'));
        })
      );
  }
}
