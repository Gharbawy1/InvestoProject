import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { IOfferProfile } from '../../../project/interfaces/IOfferProfile';
import { environment } from '../../../../../environments/environment.development';
import { ArrayApiResponse } from '../../../../core/interfaces/ApiResponse';
import { IRecomended } from '../../interfaces/recommended';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  constructor(private http: HttpClient) {}

  getOffersForCurrentUser(): Observable<ArrayApiResponse<IOfferProfile>> {
    const url = `${environment.baseApi}${environment.offer.getAllForCurrentUser}`;
    return this.http.get<ArrayApiResponse<IOfferProfile>>(url);
  }

  getAcceptedOffers(id: string): Observable<ArrayApiResponse<IOfferProfile>> {
    const url = `${environment.baseApi}${environment.offer.getAcceptedOffers(
      id
    )}`;
    return this.http.get<ArrayApiResponse<IOfferProfile>>(url).pipe(
      tap(() => console.log('Observable triggered')),
      catchError((error) => {
        console.error('Error fetching data:', error);
        return throwError(() => new Error('Failed to fetch data'));
      })
    );
  }

  getProjectByCategory(
    categoryId: number
  ): Observable<ArrayApiResponse<IRecomended>> {
    const url = `${
      environment.baseApi
    }${environment.project.getProjectsByCategory(categoryId)}`;
    return this.http.get<ArrayApiResponse<IRecomended>>(url).pipe(
      catchError((error) => {
        console.error('Error fetching data:', error);
        return throwError(() => new Error('Failed to fetch data'));
      })
    );
  }
}
