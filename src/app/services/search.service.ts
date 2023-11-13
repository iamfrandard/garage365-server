import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Search } from '../models/search.model';

const baseUrl = 'http://localhost:8080/api/appointment';

@Injectable({
  providedIn: 'root',
})
export class SearchServiceComponent {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Search[]> {
    return this.http.get<Search[]>(baseUrl);
  }

  get(id: any): Observable<Search> {
    return this.http.get<Search>(`${baseUrl}/${id}`);
  }

  getDirecciones(id: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}/${id}`);
  }

  getServicios(id: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByTitle(value: any): Observable<Search[]> {
    return this.http.get<Search[]>(`${baseUrl}?WorkshopName=${value}`);
  }
}
