import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Iinvestment } from '../../interfaces/iinvestment';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class InvestmentService {
  private api = environment.baseApi;

  constructor(private http: HttpClient) {}

  getInvestmentsByInvestorId(investorId: string): Observable<Iinvestment[]> {
    const url = `${this.api}/Investment/investor/${investorId}`;
    return this.http.get<Iinvestment[]>(url);
  }
}
