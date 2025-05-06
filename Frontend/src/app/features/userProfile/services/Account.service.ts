import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { UserProfile } from '../interfaces/UserProfile';
import { UpdateProfileDto } from '../interfaces/UpdateProfile';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private getProfileData = `${environment.baseApi}${environment.account.getCurrentProfile}`;
  private updateProfileData = `${environment.baseApi}${environment.account.updateProfile}`;
  private uploadProfilePictureUrl = `${environment.baseApi}${environment.account.uploadProfilePicture}`;

  constructor(private http: HttpClient) {}

  /**
   * Fetches the currently authenticated user's full profile
   */
   getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.getProfileData);
  }

  /**
   * Updates the user's profile fields
   */
  updateProfile(data: UpdateProfileDto): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.updateProfileData, data);
  }

  /**
   * Uploads a new profile picture and returns updated profile
   */
  uploadProfilePicture(file: File): Observable<UserProfile> {
    const fd = new FormData();
    fd.append('profilePicture', file);
    return this.http.post<UserProfile>(this.uploadProfilePictureUrl, fd);
  }
}
