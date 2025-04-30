import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../../interfaces/icategory';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { ArrayApiResponse } from '../../../../core/interfaces/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.baseApi}${environment.category.getAll}`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<ArrayApiResponse<ICategory>> {
    return this.http.get<ArrayApiResponse<ICategory>>(this.apiUrl);
  }
}
