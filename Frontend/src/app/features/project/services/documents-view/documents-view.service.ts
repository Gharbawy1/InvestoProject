import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDocument } from '../../interfaces/IDocument';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DocumentViewService {
  private apiUrl = environment.documentUrl;
  
  constructor(private http: HttpClient) { }

  getDocuments(): Observable<IDocument[]> {
    return this.http.get<IDocument[]>(this.apiUrl);
  }

  /** Fetch only documents belonging to a specific user/owner */
  getDocumentsByUser(userId: string): Observable<IDocument[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<IDocument[]>(this.apiUrl, { params });
  }
}