import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProjectCard } from '../../interfaces/iprojectcard';
import { environment } from '../../../../../environments/environment.development';
import { ArrayApiResponse } from '../../../../core/interfaces/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class ProjectCardService {
  private apiUrl = `${environment.baseApi}${environment.project.getAll}`;

  constructor(private http: HttpClient) {}

  getProjects(): Observable<ArrayApiResponse<IProjectCard>> {
    return this.http.get<ArrayApiResponse<IProjectCard>>(this.apiUrl);
  }

  progressPercentage(fundingProgress: number, fundingGoal: number): number {
    return Math.min(Math.round((fundingProgress / fundingGoal) * 100), 100);
  }
}
