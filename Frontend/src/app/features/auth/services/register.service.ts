// src/app/core/services/register/register.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IGuest } from '../interfaces/iguest';
import { IBusinessOwner } from '../interfaces/ibusinessOwner';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { IInvestor } from '../interfaces/iinvestor';
import { IUser } from '../interfaces/iuser';
import { response } from 'express';
import { AuthResponse } from '../../../core/interfaces/AuthResponse';
import { UserDetails } from '../../../core/interfaces/UserDetails';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private guestUrl = `${environment.baseApi}${environment.account.registerUser}`;
  private businessUrl = `${environment.baseApi}${environment.account.registerBusinessOwner}`;
  private investorUrl = `${environment.baseApi}${environment.account.registerInvestor}`;

  constructor(private http: HttpClient) {}

  registerGuest(guestData: IGuest): Observable<any> {
    return this.http.post<UserDetails>(this.guestUrl, guestData);
  }

  registerBusiness(businessData: FormData): Observable<any> {
    return this.http.post<UserDetails>(this.businessUrl, businessData);
  }
  registerInvestor(investorData: FormData): Observable<any> {
    return this.http.post<UserDetails>(this.investorUrl, investorData);
  }
}
