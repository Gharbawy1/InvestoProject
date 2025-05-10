import { Injectable } from '@angular/core';
import { DashboardBusiness } from '../interfaces/IDashboardBusiness';
import { environment } from '../../../../environments/environment.development';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ObjectApiResponse } from '../../../core/interfaces/ApiResponse';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class BusinessForCurrentService {
  getCurrentUserProject = `${environment.baseApi}${environment.project.getProjectForCurrentUser}`;
  updateProject = `${environment.baseApi}${environment.project.updateById}`;
  deleteProject = `${environment.baseApi}${environment.project.deleteById}`;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getProjectsForCurrentUser(): Observable<
    ObjectApiResponse<DashboardBusiness>
  > {
    return this.http.get<ObjectApiResponse<DashboardBusiness>>(
      this.getCurrentUserProject
    );
  }

  updateProjectById(
    id: number,
    data: any
  ): Observable<ObjectApiResponse<DashboardBusiness>> {
    return this.http.put<ObjectApiResponse<DashboardBusiness>>(
      `${this.updateProject}/${id}`,
      data
    );
  }

  deleteProjectById(id: number) {
    return this.http.delete(`${this.deleteProject}/${id}`).pipe(
      tap((res) => console.log('Delete succeeded:', res)),
      catchError((err) => {
        const errorMsg = this.toastr.error('Delete failed: Project Has Offers');
        return throwError(() => err);
      })
    );
  }
}
