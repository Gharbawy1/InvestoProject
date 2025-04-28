import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IInvestor } from '../../../auth/interfaces/iinvestor';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class InvestorService {
  private baseUrl = `${environment.baseApi}`;

  constructor(private http: HttpClient) {}

  // Get investor by ID
  getInvestorById(id: number): Observable<IInvestor> {
    return this.http.get<IInvestor>(`${this.baseUrl}/${id}`);
  }

  // patch/update
  updateInvestor(id: number, data: Partial<IInvestor>): Observable<IInvestor> {
    return this.http.patch<IInvestor>(`${this.baseUrl}/${id}`, data);
  }
}
