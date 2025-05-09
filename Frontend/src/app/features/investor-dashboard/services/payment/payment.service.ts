import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObjectApiResponse } from '../../../../core/interfaces/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  createCheckoutSession(
    projectId: number,
    offerId: number
  ): Observable<ObjectApiResponse<string>> {
    return this.http.post<ObjectApiResponse<string>>(
      `${environment.baseApi}${environment.payment.createCheckoutSession}`,
      { projectId, offerId }
    );
  }
}
