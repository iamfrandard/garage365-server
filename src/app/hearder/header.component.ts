import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageServiceComponent } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { EventBusService } from '../shared/event-bus.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private roles: string[] = [];
  public currentUser: string = '';
  isLoggedIn = false;
  firstName?: string;

  menuOpen = false;

  eventBusSub?: Subscription;

  constructor(
    private storageService: StorageServiceComponent,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser().roles;
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;

      this.firstName = user.email;
    }

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        this.storageService.clean();
        this.router.navigate(['/ingreso']);
      },
      error: err => {
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  
}
