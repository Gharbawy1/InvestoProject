import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProjectCard } from '../interfaces/iprojectcard';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'https://your-api-url.com/projects'; // API

  constructor(private http: HttpClient) {}

  getProjects(): Observable<IProjectCard[]> {
    return this.http.get<IProjectCard[]>(this.apiUrl);
  }
}
