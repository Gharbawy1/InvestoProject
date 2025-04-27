import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBusinessProfile } from '../interfaces/IBusinessProfile';

@Injectable({
  providedIn: 'root',
})
export class BusinessApprovalService {
  private pendingProjectsUrl = `${environment.baseApi}${environment.project.getAll}`;
  private updateProjectsUrl = `${environment.baseApi}${environment.project.updateById}`;
  constructor(private http: HttpClient) {}

  getProjects(): Observable<IBusinessProfile[]> {
    return this.http.get<IBusinessProfile[]>(this.pendingProjectsUrl);
  }

  updateProjectStatus(
    projectId: string,
    status: 'Approved' | 'Rejected' | 'Pending'
  ): Observable<any> {
    return this.http.put(this.updateProjectsUrl, { projectId, status });
  }
}
