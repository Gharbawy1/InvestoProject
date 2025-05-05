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

  /** Upper‑case the first letter of the key */
  private toPascalCase(key: string): string {
    // Split camelCase into words and capitalize each word
    return key
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase into separate words
      .split(' ') // Split into array of words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(''); // Join words without spaces
  }

  /** Build a FormData by remapping each property to PascalCase */
  private buildFormData(biz: IBusiness): FormData {
    const fd = new FormData();
    Object.entries(biz).forEach(([key, val]) => {
      const apiKey = this.toPascalCase(key);
      if (val instanceof File) {
        fd.append(apiKey, val, val.name);
      } else {
        fd.append(apiKey, String(val));
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
    return this.http.post<any>(this.apiUrl, payload);
  }

  getProjectsForCurrentUser(): Observable<ObjectApiResponse<IBusiness>> {
    return this.http.get<ObjectApiResponse<IBusiness>>(this.currentUserProject);
  }
}
