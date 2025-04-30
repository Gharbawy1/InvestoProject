import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Iinvestment } from '../../interfaces/iinvestment';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  private api = `${environment.baseApi}/Watchlist`;

  constructor(private http: HttpClient) {}

  // Fetch watchlist for a specific investor
  getWatchlistByInvestorId(id: string): Observable<Iinvestment[]> {
    return this.http.get<Iinvestment[]>(`${this.api}/investor/${id}`);
  }
}
