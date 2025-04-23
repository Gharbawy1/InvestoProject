// src/app/core/services/register/register.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GuestRegister } from '../interfaces/guest-register';
import { BusinessRegister } from '../interfaces/business-register';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private guestUrl = ''; //https://yourapi.com/api/register/guest
  private businessUrl = ''; //https://yourapi.com/api/register/business

  constructor(private http: HttpClient) {}

  registerGuest(guestData: GuestRegister): Observable<any> {
    return this.http.post(this.guestUrl, guestData);
  }

  registerBusiness(businessData: BusinessRegister): Observable<any> {
    const formData = new FormData();
    Object.entries(businessData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return this.http.post(this.businessUrl, formData);
  }
}
