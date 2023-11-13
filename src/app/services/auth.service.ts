import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  verifyAccountU(workshopId: any): Observable<any> {
    return this.http.get(`${AUTH_API}verifyAccountU/${workshopId}`);
  }

  verifyAccountE(workshopId: any): Observable<any> {
    return this.http.get(`${AUTH_API}verifyAccountE/${workshopId}`);
  }

  getAllEmployee(workshopId: string): Observable<any> {
    return this.http.get(`${AUTH_API}getAllEmployee/${workshopId}`);
  }
  addEmployee(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}addEmployee`, data);
  }
  updateEmployee(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}updateEmployee`, data);
  }
  deleteEmployee(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}deleteEmployee`, data);
  }

  getAllService(workshopId: string): Observable<any> {
    return this.http.get(`${AUTH_API}getAllService/${workshopId}`);
  }
  addService(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}addService`, data);
  }
  updateService(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}updateService`, data);
  }
  deleteService(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}deleteService`, data);
  }

  getAllSchedule(workshopId: string): Observable<any> {
    return this.http.get(`${AUTH_API}getAllSchedule/${workshopId}`);
  }
  addSchedule(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}addSchedule`, data);
  }
  updateSchedule(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}updateSchedule`, data);
  }
  deleteSchedule(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}deleteSchedule`, data);
  }

  getAllDetails(workshopId: any): Observable<any>{
    return this.http.get(`${AUTH_API}getAllDetails/${workshopId}`);
  }
  updateDetails(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}updateDetails`, data);
  }

  addVehicle(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}addVehicle`, data);
  }
  updateVehicle(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}updateVehicle`, data);
  }
  deleteVehicle(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}deleteVehicle`, data);
  }

  updateDetailsWorkshop(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}updateDetailsWorkshop`, data);
  }

  addLocationWorkshop(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}addLocationWorkshop`, data);
  }
  updateLocationWorkshop(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}updateLocationWorkshop`, data);
  }
  deleteLocationWorkshop(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}deleteLocationWorkshop`, data);
  }

  addBrandWorkshop(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}addBrandWorkshop`, data);
  }
  updateBrandWorkshop(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}updateBrandWorkshop`, data);
  }
  deleteBrandWorkshop(data: any): Observable<any> {
    return this.http.post(`${AUTH_API}deleteBrandWorkshop`, data);
  }

  login(inputMail: string, inputPassword: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        inputMail,
        inputPassword,
      },
      httpOptions
    );
  }

  checkEmailExists(inputMail: string): Observable<any> {
    return this.http.post(AUTH_API + 'checkEmail', { inputMail }, httpOptions);
  }

  getUserIdByEmail(inputMail: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'getUserIdByEmail',
      { inputMail },
      httpOptions
    );
  }

  register(
    inputName: string,
    inputLastName: string,
    inputNumber: string,
    inputID: string,
    inputMail: string,
    inputPassword: string,
    inputAddress: string,
    inputAddress2: string,
    inputProvince: string,
    inputCity: string,
    inputSector: string,
    vehicles: Array<{
      inputType: string;
      inputBrand: string;
      inputModel: string;
      inputYear: string;
      inputCarID: string;
    }>
  ): Observable<any> {
    return this.http.post(
      AUTH_API + 'signupU',
      {
        inputName,
        inputLastName,
        inputNumber,
        inputID,
        inputMail,
        inputPassword,
        inputAddress,
        inputAddress2,
        inputProvince,
        inputCity,
        inputSector,
        vehicles,
      },
      httpOptions
    );
  }

  registerWorkshop(
    inputNameWorkshop: string,
    inputNumberW: string,
    inputMailW: string,
    inputPasswordW: string,
    inputImage: File,
    inputCertificate: File,
    inputWorkshopID: string,
    addedLocations: Array<{
      Adress: string;
      Adress2: string;
      Province: string;
      city: string;
      Sector: string;
    }>,
    inputBrandW: string[],
    services: Array<{
      inputService: string;
      inputServiceDescription: string;
    }>
  ): Observable<any> {
    const formData = new FormData();
    formData.append('inputNameWorkshop', inputNameWorkshop);
    formData.append('inputNumberW', inputNumberW);
    formData.append('inputMailW', inputMailW);
    formData.append('inputPasswordW', inputPasswordW);
    formData.append('inputImage', inputImage);
    formData.append('inputCertificate', inputCertificate);
    formData.append('inputWorkshopID', inputWorkshopID);

    addedLocations.forEach((location, index) => {
      formData.append(`inputAddressW${index}`, location.Adress);
      formData.append(`inputAddress2W${index}`, location.Adress2);
      formData.append(`inputProvinceW${index}`, location.Province);
      formData.append(`inputCityW${index}`, location.city);
      formData.append(`inputSectorW${index}`, location.Sector);
    });

    for (let i = 0; i < inputBrandW.length; i++) {
      formData.append('inputBrandW' + i, inputBrandW[i]);
    }

    services.forEach((service, index) => {
      formData.append(`inputServices${index}`, service.inputService);
      formData.append(
        `inputServiceDescription${index}`,
        service.inputServiceDescription
      );
    });

    return this.http.post(AUTH_API + 'signupE', formData);
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', {}, httpOptions);
  }
}
