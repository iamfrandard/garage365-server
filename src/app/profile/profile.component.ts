import { Component, OnInit } from '@angular/core';
import { StorageServiceComponent } from '../services/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;

  constructor(private storageService: StorageServiceComponent) { }

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
  }
}
