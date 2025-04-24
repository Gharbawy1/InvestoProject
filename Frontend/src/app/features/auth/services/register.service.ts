// src/app/core/services/register/register.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IGuest } from '../interfaces/iguest';
import { IBusiness } from '../interfaces/ibusiness';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private guestUrl = ''; //https://yourapi.com/api/register/guest
  private businessUrl = ''; //https://yourapi.com/api/register/business

  constructor(private http: HttpClient) {}

  registerGuest(guestData: IGuest): Observable<any> {
    return this.http.post(this.guestUrl, guestData);
  }

  registerBusiness(businessData: IBusiness): Observable<any> {
    const formData = new FormData();
    Object.entries(businessData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return this.http.post(this.businessUrl, formData);
  }
}
