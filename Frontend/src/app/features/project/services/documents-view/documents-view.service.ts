import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BusinessDocuments } from '../../interfaces/BusinessDocuments';
import { environment } from '../../../../../environments/environment.development';
import { ObjectApiResponse } from '../../../../core/interfaces/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class DocumentViewService {
  private getDocumentsUrl = `${environment.baseApi}${environment.project.getDocuments}`
  constructor(private http: HttpClient) {}

  getDocuments(projectId: number): Observable<BusinessDocuments> {
    return this.http.get<{ 
      data: BusinessDocuments, 
      isValid: boolean, 
      errorMessage?: string 
    }>(`${this.getDocumentsUrl}/${projectId}`).pipe(
      map(resp => {
        if (!resp.isValid) {
          throw new Error(resp.errorMessage || 'Failed to load documents');
        }
        return resp.data;
      })
    );
  }
}
