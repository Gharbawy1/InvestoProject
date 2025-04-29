import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IProjectCard } from '../../interfaces/iprojectcard';
import { environment } from '../../../../../environments/environment.development';
import { IBusiness } from '../../interfaces/IBusiness';
import { IBusinessDetails } from '../../interfaces/IBusinessDetails';

@Injectable({
  providedIn: 'root',
})
export class ProjectCardService {
  private apiUrl = `${environment.apiBase}/Project`;

  constructor(private http: HttpClient) {}

  getProjects(): Observable<IProjectCard[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.data.map((project: IBusinessDetails) => this.mapToProjectCard(project)))
    );
  }

  progressPercentage(fundingProgress: number, fundingGoal: number): number {
    return Math.min(Math.round((fundingProgress / fundingGoal) * 100), 100);
  }

  mapToProjectCard(apiResponse: IBusinessDetails): IProjectCard {
    return {
      id: apiResponse.id,
      projectTitle: apiResponse.projectTitle,
      subtitle: apiResponse.subtitle,
      projectImageURL: apiResponse.projectImageUrl,
      fundingGoal: apiResponse.fundingGoal,
      raisedFunds: apiResponse.raisedFund,
      category: apiResponse.categoryName,
      owner: apiResponse.ownerId,
    };
  }
}
