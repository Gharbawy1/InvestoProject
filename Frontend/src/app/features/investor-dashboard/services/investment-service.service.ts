import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Iinvestment } from '../interfaces/iinvestment';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class InvestmentService {
  private apiUrl = `${environment.baseApi}/investments`;

  constructor(private http: HttpClient) {}
  getInvestmentsByInvestorId(investorId: string): Observable<Iinvestment[]> {
    return this.http.get<Iinvestment[]>(`${this.apiUrl}/investor/${investorId}`);
  }
  
}
