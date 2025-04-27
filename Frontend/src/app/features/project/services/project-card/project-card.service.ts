import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProjectCard } from '../../interfaces/iprojectcard';


@Injectable({
  providedIn: 'root'
})
export class ProjectCardService {
  private apiUrl = 'https://your-api-url.com/projects'; // API

  constructor(private http: HttpClient) {}

  getProjects(): Observable<IProjectCard[]> {
    return this.http.get<IProjectCard[]>(this.apiUrl);
  }
  
  progressPercentage(fundingProgress: number, fundingGoal: number): number {
    return Math.min(Math.round((fundingProgress / fundingGoal) * 100), 100);
  }
  
  
}
