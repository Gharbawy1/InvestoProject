import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOffer } from '../interfaces/ioffer';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  private baseUrl = ''; // https://your-api-url.com/api/offers  =>API 

  constructor(private http: HttpClient) {}

  getAllOffers(): Observable<IOffer[]> {
    return this.http.get<IOffer[]>(this.baseUrl);
  }

  getOfferById(id: number): Observable<IOffer> {
    return this.http.get<IOffer>(`${this.baseUrl}/${id}`);
  }

  createOffer(offer: Partial<IOffer>): Observable<IOffer> {
    return this.http.post<IOffer>(this.baseUrl, offer);
  }

  updateOffer(id: number, offer: Partial<IOffer>): Observable<IOffer> {
    return this.http.patch<IOffer>(`${this.baseUrl}/${id}`, offer);
  }

  deleteOffer(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
