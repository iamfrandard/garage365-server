import { Component, OnInit } from '@angular/core';
import { StorageServiceComponent } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import data from './Cars.json';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  currentUser: any;
  
  constructor
  (
    private storageService: StorageServiceComponent,
    ) { }

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
  }
}