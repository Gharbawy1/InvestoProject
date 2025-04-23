import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../interfaces/icategory';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http : HttpClient) { }
  
  api : string = "";
  getCategories(): Observable<ICategory[]>{
    return this.http.get<ICategory[]>(this.api);
  }
}
