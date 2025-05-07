import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectApiResponse } from '../../../../core/interfaces/ApiResponse';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { UpgradeResponse } from '../../interfaces/UpgradeResponse ';

@Injectable({
  providedIn: 'root',
})
export class UpgradeService {
  investorApiUrl = `${environment.baseApi}${environment.account.upgradeToInvestor}`;
  ownerApiUrl = `${environment.baseApi}${environment.account.upgradeToBusinessOwner}`;

  constructor(private http: HttpClient) {}

  upgradeToInvestor(formData: FormData): Observable<UpgradeResponse> {
    return this.http.post<UpgradeResponse>(this.investorApiUrl, formData);
  }

  upgradeToBusinessOwner(formData: FormData): Observable<UpgradeResponse> {
    for (const [key, value] of formData) {
      console.log(`${key}:`, value);
    }
    return this.http.post<UpgradeResponse>(this.ownerApiUrl, formData);
  }
}
