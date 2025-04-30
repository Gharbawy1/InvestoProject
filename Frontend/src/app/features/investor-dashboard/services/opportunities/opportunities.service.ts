import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Iinvestment } from '../../interfaces/iinvestment';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OpportunitiesService {
  private api = `${environment.baseApi}/Opportunities`;

  constructor(private http: HttpClient) {}

  // Fetch available opportunities
  getAvailableOpportunities(): Observable<Iinvestment[]> {
    return this.http.get<Iinvestment[]>(this.api);
  }
}
