import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  createCheckoutSession(
    projectId: number,
    offerId: number
  ): Observable<{ sessionUrl: string }> {
    return this.http.post<{ sessionUrl: string }>(
      `${environment.baseApi}${environment.payment.createCheckoutSession}`,
      { projectId, offerId }
    );
  }
}
