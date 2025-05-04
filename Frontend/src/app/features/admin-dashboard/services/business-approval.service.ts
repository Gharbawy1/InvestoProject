import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { IBusinessProfile } from '../interfaces/IBusinessProfile';
import { ObjectApiResponse } from '../../../core/interfaces/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class BusinessApprovalService {
  private getAllProjectsUrl = `${environment.baseApi}${environment.project.getAll}`;
  private getProjectsbyStatus = `${environment.baseApi}${environment.project.getProjectsbyStatus}`;
  private updateStatusUrl = `${environment.baseApi}${environment.project.updateReviewStatus}`;

  constructor(private http: HttpClient) {}

   /** GET all projects */
   getAllProjects(): Observable<IBusinessProfile[]> {
    return this.http
      .get<ObjectApiResponse<IBusinessProfile[]>>(this.getAllProjectsUrl)
      .pipe(map(res => res.data || []));
  }

   /** GET projects filtered by status */
  getbyStatus(status: 'Pending' | 'Accepted' | 'Rejected'): Observable<IBusinessProfile[]> {
    const params = new HttpParams().set('status', status);
    return this.http
      .get<ObjectApiResponse<IBusinessProfile[]>>(this.getProjectsbyStatus, { params })
      .pipe(
        map(res => res.data || []),
        catchError(err => {
          if (err.status === 404) {
            return of([] as IBusinessProfile[]);
          }
          return throwError(() => err);
        })
      );
  }
  
  /** PUT to update a single project’s status */
  updateStatus(
    projectId: number,
    status: 'Accepted' | 'Rejected'
  ): Observable<string> {
    return this.http.put(
      this.updateStatusUrl,
      { projectId, status },
      { responseType: 'text' }  // ← key: treat the body as text
    );
  }
}
