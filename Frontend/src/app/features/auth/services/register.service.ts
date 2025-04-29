// src/app/core/services/register/register.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IGuest } from '../interfaces/iguest';
import { IBusinessOwner } from '../interfaces/ibusinessOwner';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { IInvestor } from '../interfaces/iinvestor';
import { IUser } from '../interfaces/iuser';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private guestUrl = `${environment.baseApi}${environment.account.registerUser}`;
  private businessUrl = `${environment.baseApi}${environment.account.registerBusinessOwner}`;
  private investorUrl = `${environment.baseApi}${environment.account.registerInvestor}`;

  constructor(private http: HttpClient) {}

  registerGuest(guestData: IGuest): Observable<any> {
    return this.http.post<IUser>(this.guestUrl, guestData);
  }

  registerBusiness(businessData: IBusinessOwner): Observable<any> {
    const formData = new FormData();
    Object.entries(businessData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return this.http.post<IUser>(this.businessUrl, formData);
  }
  registerInvestor(investorData: IInvestor): Observable<any> {
    const formData = new FormData();
    Object.entries(investorData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return this.http.post<IUser>(this.investorUrl, formData);
  }
}
