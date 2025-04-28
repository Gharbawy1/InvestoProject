import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
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

  constructor(private http: HttpClient, private authService: AuthService) {}

  getFullProjectDetails(
    projectId: string
  ): Observable<{ project: IBusinessDetails; owner: UserDetails }> {
    return this.http
      .get<IBusinessDetails>(`${this.projectUrl}/${projectId}`)
      .pipe(
        switchMap((project) =>
          this.authService
            .getUserById(project.ownerId)
            .pipe(switchMap((owner) => of({ project, owner })))
        ),
        catchError((error) => {
          console.error('Error loading project details:', error);
          return throwError(() => new Error('Failed to load project details'));
        })
      );
  }
}
