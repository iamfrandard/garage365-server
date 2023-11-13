import { Component, OnInit } from '@angular/core';
import { StorageServiceComponent } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import Brands from './Brands.json';
import Locations from './Location.json';

@Component({
  selector: 'app-settings-workshop',
  templateUrl: './settings-workshop.component.html',
  styleUrls: ['./settings-workshop.component.css']
})
export class SettingsWorkshopComponent implements OnInit {
  currentWorkshop: any;
  currentWorkshopData: any;

  currentDetails: any = null;
  currentLocationWorkshop: any = null;
  currentBrandWorkshop: any = null;

  dataNew: any = null;

  dataBrands = Brands;
  dataLocations = Locations;

  address: any = null;
  address2: any = null;
  selectedProvince: any = null;
  selectedCity: any = null;
  selectedSector: any = null;

  selectedBrand: any = null;

  constructor
  (
    private storageService: StorageServiceComponent,
    private _AuthService: AuthService,
    private http: HttpClient,
    ) { }

  ngOnInit(): void {
    this.currentWorkshop = this.storageService.getUser();
    this.getAllDetailsWorkshop();
  }

  getAllDetailsWorkshop(): void{
    this._AuthService.getAllDetails(this.currentWorkshop.id).subscribe(data => {
      this.currentWorkshopData = data;
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  updateDetailsWorkshop(): void{
    const data = {
      workshopID: this.currentWorkshop.id,
      dataOld: this.currentDetails,
      dataNew: this.dataNew,
    };

    this._AuthService.updateDetailsWorkshop(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllDetailsWorkshop();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  addLocationWorkshop(): void{
    const data = {
      id: this.currentWorkshop.id,
      address: this.address,
      address2: this.address2,
      province: this.selectedProvince,
      city: this.selectedCity,
      sector: this.selectedSector,
    };

    this._AuthService.addLocationWorkshop(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllDetailsWorkshop();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  updateLocationWorkshop(): void{
    const data = {
      id: this.currentWorkshop.id,
      LocationID: this.currentLocationWorkshop._id,
      address: this.address,
      address2: this.address2,
      province: this.selectedProvince,
      city: this.selectedCity,
      sector: this.selectedSector,
    };

    this._AuthService.updateLocationWorkshop(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllDetailsWorkshop();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  deleteLocationWorkshop(): void{
    const data = {
      id: this.currentWorkshop.id,
      LocationID: this.currentLocationWorkshop._id,
      address: this.address,
      address2: this.address2,
      province: this.selectedProvince,
      city: this.selectedCity,
      sector: this.selectedSector,
    };

    this._AuthService.deleteLocationWorkshop(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllDetailsWorkshop();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  addBrandWorkshop(): void{
    const data = {
      id: this.currentWorkshop.id,
      name: this.selectedBrand,
    };

    this._AuthService.addBrandWorkshop(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllDetailsWorkshop();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  updateBrandWorkshop(): void{
    const data = {
      id: this.currentWorkshop.id,
      BrandID: this.currentBrandWorkshop._id,
      name: this.selectedBrand,
    };

    this._AuthService.updateBrandWorkshop(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllDetailsWorkshop();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  deleteBrandWorkshop(): void{
    const data = {
      id: this.currentWorkshop.id,
      BrandID: this.currentBrandWorkshop._id,
      name: this.selectedBrand,
    };

    this._AuthService.deleteBrandWorkshop(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllDetailsWorkshop();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  refreshWindow() {
    window.location.reload();
  }

  selectLocationWorkshop(x: any) {
    if (this.currentLocationWorkshop) {
        this.currentLocationWorkshop.isSelected = false;
    }
    if (this.currentLocationWorkshop !== x) {
      x.isSelected = true;
        this.currentLocationWorkshop = x;
        this.address = this.currentLocationWorkshop.address;
        this.address2 = this.currentLocationWorkshop.address2;
        this.selectedProvince = this.currentLocationWorkshop.province;
        this.selectedCity = this.currentLocationWorkshop.city;
        this.selectedSector = this.currentLocationWorkshop.sector;
        
    } else {
        this.currentLocationWorkshop = null;
    }
  }

  selectBrandWorkshop(x: any) {
    if (this.currentBrandWorkshop) {
        this.currentBrandWorkshop.isSelected2 = false;
    }
    if (this.currentBrandWorkshop !== x) {
      x.isSelected2 = true;
        this.currentBrandWorkshop = x;
        this.selectedBrand = this.currentBrandWorkshop.name;
    } else {
        this.currentBrandWorkshop = null;
    }
  }

  selectDetailsWorkshop(x: any) {
    this.currentDetails = x;
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
