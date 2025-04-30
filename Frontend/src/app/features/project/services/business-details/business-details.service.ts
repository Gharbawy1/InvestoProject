import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment.development';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { IBusinessDetails } from '../../interfaces/IBusinessDetails';
import { ObjectApiResponse } from '../../../../core/interfaces/ApiResponse';

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
  constructor(private http: HttpClient, private authService: AuthService) {}
  getProjectDetails(projectId: string): Observable<IBusinessDetails> {
    const projectUrl = `${environment.baseApi}${environment.project.getById(
      projectId
    )}`;
    return this.http.get<ObjectApiResponse<IBusinessDetails>>(projectUrl).pipe(
      map((response) => response.data),
      catchError((err) => {
        console.error('Error loading project:', err);
        return throwError(() => new Error('Failed to load project'));
      })
    );
  }
}
