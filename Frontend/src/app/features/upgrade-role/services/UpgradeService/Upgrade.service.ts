import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectApiResponse } from '../../../../core/interfaces/ApiResponse';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UpgradeService {
  investorApiUrl = `${environment.baseApi}${environment.account.upgradeToInvestor}`;
  ownerApiUrl = `${environment.baseApi}${environment.account.upgradeToBusinessOwner}`;

  constructor(private http: HttpClient) {}

  upgradeToInvestor(formData: FormData): Observable<HttpEvent<ObjectApiResponse<boolean>>> {
    return this.http.post<ObjectApiResponse<boolean>>(this.investorApiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(catchError(this.handleError));
  }

  upgradeToBusinessOwner(formData: FormData): Observable<HttpEvent<ObjectApiResponse<boolean>>> {
    return this.http.post<ObjectApiResponse<boolean>>(this.ownerApiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    console.error('[UpgradeService]', err);
    const msg = err.error?.errorMessage || 'Server error';
    return throwError(() => new Error(msg));
  }
}
