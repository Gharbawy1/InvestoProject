import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBusinessProfile } from '../interfaces/IBusinessProfile';

@Injectable({
  providedIn: 'root'
})
export class BusinessApprovalService {
  private apiUrl = `${environment.apiBase}/businessProfiles`;

  constructor(private http: HttpClient) {}

  getProjects(): Observable<IBusinessProfile[]> {
    return this.http.get<IBusinessProfile[]>(this.apiUrl);
  }

  updateProjectStatus(projectId: string, status: 'approved' | 'rejected' | 'pending'): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${projectId}`, { status });
  }
  
}
