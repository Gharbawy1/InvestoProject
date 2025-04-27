import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs'; 
import { environment } from '../../../../../environments/environment.development';

@Injectable({  
providedIn: 'root' 
})
export class BusinessCreationService {
  // Base URL for business profiles endpoints
  private apiUrl = `${environment.apiBase}/businessProfiles`;

  constructor(private http: HttpClient) { }

  /**
   * Posts a FormData payload to create a new business profile on the backend.
   * @param data FormData containing project details and ownerId
   * @returns Observable<any> of the server response
   */
  postBusinessCreation(data: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
  
}

