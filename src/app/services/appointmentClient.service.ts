import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

const baseUrl = 'http://localhost:8080/api/appointmentClient';

@Injectable({
  providedIn: 'root',
})
export class AppointmentClientService {
  constructor(private http: HttpClient) {}

  getReviews(workshopId: string) {
    return this.http.get<any[]>(`${baseUrl}/${workshopId}/reviews`);
  }

  postReviews(workshopId: string, rating: number, comment: string): Observable<any> {
    const review = { rating, comment };
    return this.http.post(`${baseUrl}/${workshopId}/addReview`, review);
  }

  cancelAppointment(AppointmentID: string, DateF: string) {
    const Date = {DateF}
    return this.http.post(`${baseUrl}/${AppointmentID}/cancelAppointment`, Date);
  }

  getAllEmployee(workshopName: any) {
    return this.http.get<any[]>(`${baseUrl}/${workshopName}/getAllEmployee`);
  }

  getWorkshopList(): Observable<any> {
    return this.http.get(`${baseUrl}`);
  }

  getAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(baseUrl);
  }

  //
  get(id: any): Observable<Appointment> {
    return this.http.get<Appointment>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  //
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  //
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  //
  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  //
  findByTitle(title: any): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${baseUrl}?title=${title}`);
  }
}
