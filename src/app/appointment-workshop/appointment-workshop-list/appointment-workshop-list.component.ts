import { Component, Input} from '@angular/core';
import { Appointment } from 'src/app/models/appointment.model';
import { Usuario } from 'src/app/models/usuario.model';
import { AppointmentClientService } from 'src/app/services/appointmentClient.service';
import { AppointmentWorkshopService } from 'src/app/services/appointmentWorkshop.service';

@Component({
  selector: 'app-appointment-workshop-list',
  templateUrl: './appointment-workshop-list.component.html',
  styleUrls: ['./appointment-workshop-list.component.css'],
})
export class AppointmentWorkshopListComponent {
@Input() Appointment: Appointment = {
    UserID: '',
    Workshop: '',
    Schedule: '',
    Status: '',
    Bill: '',
    Confirm: false,
  };

  @Input() User: Usuario = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    idNumber: '',
    email: '',
  };

  tutorials?: Appointment[];
  user?: Usuario[];
  currentAppointment: Appointment = {};
  currentUser: Usuario = {};

  employee: any[] = [];
  selectedEmployee: any = null;

  constructor(
    private _AppointmentWorkshopService: AppointmentWorkshopService,
    private _AppointmentClientService: AppointmentClientService,
    
    ) {}

  ngOnInit(): void {
    this.retrieveTutorials();
  } 

  resetSelectedEmployee(): void {
    this.selectedEmployee = 'null';
  }

  getAllEmployee(): void{
    this._AppointmentClientService.getAllEmployee(this.currentAppointment.Workshop).subscribe({
      next: (data: any[]) => {
        this.employee = data;
      },
      error: (e) => console.error(e)
    });
  }

  updatePublished(Confirm: boolean): void {
    const data = {
      Confirm: Confirm,
      Employee: this.selectedEmployee 
    };

    this._AppointmentClientService.update(this.currentAppointment.id, data).subscribe({
      next: (res) => {
        this.Appointment.Confirm = Confirm;
      },
      error: (e) => console.error(e)
    });
  }

  updateStatus(Status: string): void {
    const data = {
      Status: Status,
    };

    this._AppointmentClientService.update(this.currentAppointment.id, data).subscribe({
      next: (res) => {
        this.Appointment.Status = Status;
      },
      error: (e) => console.error(e)
    });
  }

  selectedOption: string = "";

  optionSelected() {
    if (this.selectedOption === '1') {
      this.updateStatus('Recepcion');
    } else if (this.selectedOption === '2') {
      this.updateStatus('En Progreso');
    } else if (this.selectedOption === '3') {
      this.updateStatus('Finalizado');
    }else if (this.selectedOption === '4') {
      this.updateStatus('Completado');
    }
  }

  retrieveTutorials(): void {
    this._AppointmentWorkshopService.getAll().subscribe({
      next: (data: any) => {
        this.tutorials = data.appointments;
        this.user = data.user;
      },
      error: (e) => console.error(e)
    }); 
  }

  setActiveTutorial(tutorial: Appointment, User: Usuario): void {
    this.currentAppointment = tutorial;
    this.currentUser = User;
  }

  refreshWindow() {
    window.location.reload();
  }
}
