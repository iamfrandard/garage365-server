import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { StorageServiceComponent } from '../services/storage.service';

@Component({
  selector: 'management-schedule',
  templateUrl: './management-schedule.component.html',
  styleUrls: ['./management-schedule.component.css'],
})
export class ManagementScheduleComponent {
  currentUser: string = "";
  schedule: any[] = [];
  
  currentSchedule: any = null;

  daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  selectedDay: string = "";

  allHours = Array.from({length: 24}, (_, i) => i);
  openTime: number = 0;
  closeTime: number = 0;
  availableClosingHours: number[] = this.allHours;

  nameSchedule: string = "";
  positionSchedule: string = "";

  constructor
  (
    private authService: AuthService,
    private storageService: StorageServiceComponent,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser().id;
    this.getAllSchedule();
  }

  refreshWindow() {
    window.location.reload();
  }

  getAvailableDays() {
    return this.daysOfWeek.filter(day => !this.schedule.some(schedule => schedule.day === day));
  }

  onOpenTimeChange() {
    this.availableClosingHours = this.allHours.filter(hour => hour > this.openTime);
    if (this.closeTime <= this.openTime) {
      this.closeTime = 0;
    }
  }

  getAllSchedule(): void {
    this.authService.getAllSchedule(this.currentUser).subscribe(data => {
      this.schedule = data;
    }, error => {
      console.error('NOT OK - ', error);
    });
  }
    
  selectSchedule(x: any) {
    if (this.currentSchedule) {
        this.currentSchedule.isSelected = false;
    }
    if (this.currentSchedule !== x) {
      x.isSelected = true;
        this.currentSchedule = x;
        this.selectedDay = this.currentSchedule.day;
        this.openTime = this.currentSchedule.timeStart;
        this.closeTime = this.currentSchedule.timeFinish;
    } else {
        this.currentSchedule = null;
    }
  }

  addSchedule(): void{
    const data = {
      workshopID: this.currentUser,
      day: this.selectedDay,
      timeStart: this.openTime,
      timeFinish: this.closeTime
    };

    this.authService.addSchedule(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllSchedule();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  updateSchedule(): void{
    const data = {
      workshopID: this.currentUser,
      ScheduleID: this.currentSchedule._id, 
      timeStart: this.openTime,
      timeFinish: this.closeTime
    };

    this.authService.updateSchedule(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllSchedule();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }

  deleteSchedule(): void{
    const data = {
      workshopID: this.currentUser,
      ScheduleID: this.currentSchedule._id,
    };

    this.authService.deleteSchedule(data).subscribe(response => {
      console.log('OK - ', response.message);
      this.getAllSchedule();
    }, error => {
      console.error('NOT OK - ', error);
    });
  }
}
