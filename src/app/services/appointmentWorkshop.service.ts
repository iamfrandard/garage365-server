import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

const baseUrl = 'http://localhost:8080/api/appointmentWorkshop';

@Injectable({
  providedIn: 'root',
})
export class AppointmentWorkshopService {
  constructor(private http: HttpClient) {}

  getWorkshopList(): Observable<any> {
    return this.http.get(`${baseUrl}`);
  }

  getAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(baseUrl);
  }

  get(id: any): Observable<Appointment> {
    return this.http.get<Appointment>(`${baseUrl}/${id}`);
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

  findByTitle(title: any): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${baseUrl}?title=${title}`);
  }
}
