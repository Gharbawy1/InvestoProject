import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../../interfaces/icategory';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import {
  ArrayApiResponse,
  ObjectApiResponse,
} from '../../../../core/interfaces/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<ArrayApiResponse<ICategory>> {
    const getCategoriesUrl = `${environment.baseApi}${environment.category.getAll}`;
    return this.http.get<ArrayApiResponse<ICategory>>(getCategoriesUrl);
  }

  addCategory(categoryName: string): Observable<ObjectApiResponse<ICategory>> {
    const addCategoryUrl = `${environment.baseApi}${environment.category.create}`;
    return this.http.post<ObjectApiResponse<ICategory>>(addCategoryUrl, {
      name: categoryName,
    });
  }

  deleteCategory(categoryId: number): Observable<ObjectApiResponse<ICategory>> {
    console.log(categoryId);
    const deleteCategoryUrl = `${
      environment.baseApi
    }${environment.category.deleteById(categoryId)}`;
    return this.http.delete<ObjectApiResponse<ICategory>>(deleteCategoryUrl);
  }

  updateCategory(
    categoryId: number,
    categoryName: string
  ): Observable<ObjectApiResponse<ICategory>> {
    const updateCategoryUrl = `${
      environment.baseApi
    }${environment.category.updateById(categoryId)}`;
    return this.http.put<ObjectApiResponse<ICategory>>(updateCategoryUrl, {
      name: categoryName,
    });
  }
}
