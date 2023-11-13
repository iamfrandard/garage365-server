import { Component, OnInit } from '@angular/core';
import { StorageServiceComponent } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import data from './Cars.json';

@Component({
  selector: 'app-settings-user',
  templateUrl: './settings-user.component.html',
  styleUrls: ['./settings-user.component.css']
})
export class SettingsUserComponent implements OnInit {
  currentUser: any;
  currentUserData: any;

  currentDetails: any = null;
  currentVehicle: any = null;

  dataNew: any = null;

  data = data;
  selectedType: any = null;
  selectedBrand: any = null;
  selectedModel: any = null;
  year: string = "";
  carID: string = "";

  constructor
  (
    private storageService: StorageServiceComponent,
    private _AuthService: AuthService,
    private http: HttpClient,
    ) { }

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
    this.getAllDetails();
  }

  getAllDetails(): void{
    this._AuthService.getAllDetails(this.currentUser.id).subscribe(data => {
      this.currentUserData = data;
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  updateDetails(): void{
    const data = {
      userID: this.currentUser.id,
      dataOld: this.currentDetails,
      dataNew: this.dataNew,
    };

    this._AuthService.updateDetails(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllDetails();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  addVehicle(): void{
    const data = {
      id: this.currentUser.id,
      vehicleType: this.selectedType,
      vehicleBrand: this.selectedBrand,
      vehicleModel: this.selectedModel,
      vehicleYear: this.year,
      vehicleID: this.carID,
    };

    this._AuthService.addVehicle(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllDetails();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  updateVehicle(): void{
    const data = {
      id: this.currentUser.id,
      CarID: this.currentVehicle._id,
      vehicleType: this.selectedType,
      vehicleBrand: this.selectedBrand,
      vehicleModel: this.selectedModel,
      vehicleYear: this.year,
      vehicleID: this.carID,
    };

    console.log(data)

    this._AuthService.updateVehicle(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllDetails();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  deleteVehicle(): void{
    const data = {
      id: this.currentUser.id,
      CarID: this.currentVehicle._id,
      vehicleType: this.selectedType,
      vehicleBrand: this.selectedBrand,
      vehicleModel: this.selectedModel,
      vehicleYear: this.year,
      vehicleID: this.carID,
    };

    console.log(data)

    this._AuthService.deleteVehicle(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllDetails();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  refreshWindow() {
    window.location.reload();
  }

  selectVehicle(x: any) {
    if (this.currentVehicle) {
        this.currentVehicle.isSelected = false;
    }
    if (this.currentVehicle !== x) {
      x.isSelected = true;
        this.currentVehicle = x;
        this.selectedType = this.currentVehicle.vehicleType;
        this.selectedBrand = this.currentVehicle.vehicleBrand;
        this.selectedModel = this.currentVehicle.vehicleModel;
        this.year = this.currentVehicle.vehicleYear;
        this.carID = this.currentVehicle.vehicleID;
        
    } else {
        this.currentVehicle = null;
    }
  }

  selectDetails(x: any) {
    this.currentDetails = x;
    console.log(this.currentDetails)
  }

  formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) return "";
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumber;  // o simplemente return "";
  }

  formatIdNumber(idNumber: string): string {
    if (!idNumber) return "";
    const cleaned = ('' + idNumber).replace(/\D/g, ''); 
    const match = cleaned.match(/^(\d{3})(\d{7})(\d{1})$/);
    if (match) {
      return match[1] + '-' + match[2] + '-' + match[3];
    }
    return idNumber;  // o simplemente return "";
  }  
}
