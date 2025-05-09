import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { IBusiness } from '../../interfaces/IBusiness';
import { ObjectApiResponse } from '../../../../core/interfaces/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class BusinessCreationService {
  private apiUrl = `${environment.baseApi}${environment.project.create}`;
  private currentUserProject = `${environment.baseApi}${environment.project.getProjectForCurrentUser}`;

  constructor(private http: HttpClient) {}

  /** Convert camelCase to PascalCase */
  private toPascalCase(key: string): string {
    return key.replace(/(^\w|-\w)/g, (match) => 
      match.toUpperCase().replace('-', '')
    );
  }

  private buildFormData(biz: IBusiness): FormData {
    const fd = new FormData();
    Object.entries(biz).forEach(([key, val]) => {
      const pascalKey = this.toPascalCase(key);
      if (val instanceof File) {
        fd.append(pascalKey, val, val.name);
      } else {
        fd.append(pascalKey, String(val));
      }
    });
    return fd;
  }

  /**
   * Posts an IBusiness object by internally converting
   * it to PascalCase FormData.
   */
  createProject(biz: IBusiness): Observable<any> {
    const payload = this.buildFormData(biz);
    console.log('▶️ [createProject] calling:', this.apiUrl);
    return this.http.post<any>(this.apiUrl, payload);
  }
  
  getProjectsForCurrentUser(): Observable<ObjectApiResponse<IBusiness>> {
    return this.http.get<ObjectApiResponse<IBusiness>>(this.currentUserProject);
  }
}
