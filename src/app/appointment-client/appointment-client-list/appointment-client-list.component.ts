import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/appointment.model';
import { AppointmentClientService } from 'src/app/services/appointmentClient.service';
import { StorageServiceComponent } from 'src/app/services/storage.service';

@Component({
  selector: 'app-appointment-client-list',
  templateUrl: './appointment-client-list.component.html',
  styleUrls: ['./appointment-client-list.component.css'],
})
export class AppointmentClientListComponent {
  tutorials?: Appointment[];
  currentTutorial: Appointment = {};
  currentIndex = -1;
  title = '';
  fechaActual: Date = new Date();
  fechaFormatoISO: string = this.fechaActual.toISOString();

  Estado0 = 'Completado';
  Estado1 = 'Recepcion';
  Estado2 = 'En Progreso';
  Estado3 = 'Finalizado';
  Estado4 = 'Cancelada';

  constructor(
    private _AppointmentClientService: AppointmentClientService,
    private _StorageService: StorageServiceComponent,
    ) {}

  CurrentUser = '';

  ngOnInit(): void {
    this.retrieveTutorials();
    this.CurrentUser = this._StorageService.getUser().id;
  }

  refreshWindow() {
    window.location.reload();
  }


  retrieveTutorials(): void {
    this._AppointmentClientService.getAll().subscribe({
      next: (data) => {
        this.tutorials = data;
      },
      error: (e) => console.error(e)
    });
  }

  refreshList(): void {
    this.retrieveTutorials();
    this.currentTutorial = {};
    this.currentIndex = -1;
  }

  setActiveTutorial(tutorial: Appointment, index: number): void {
    this.currentTutorial = tutorial;
    this.currentIndex = index;
  }

  removeAllTutorials(): void {
    this._AppointmentClientService.deleteAll().subscribe({
      next: (res) => {
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }

  searchTitle(): void {
    this.currentTutorial = {};
    this.currentIndex = -1;

    this._AppointmentClientService.findByTitle(this.title).subscribe({
      next: (data) => {
        this.tutorials = data;
      },
      error: (e) => console.error(e)
    });
  }

  rating: number = 0;
  comment: string = '';

  postComment(): void {
    const workshopString: string = String(this.currentTutorial.Workshop);
    this._AppointmentClientService.postReviews(workshopString, this.rating, this.comment)
    .subscribe(response => {
        console.log("OK");
        this.rating = 0;
        this.comment = '';
    }, error => {
        console.error("NOT OK");
    });
  }

  setRating(value: number): void {
      this.rating = value;
  }

  cancelAppointment(): void{
    const workshopString: string = String(this.currentTutorial.id);
    this.fechaFormatoISO;
    this._AppointmentClientService.cancelAppointment(workshopString, this.fechaFormatoISO).subscribe(response => {
      console.log("OK");
    }, erro => {
      console.error("NOT OK")
    });
  }
}
