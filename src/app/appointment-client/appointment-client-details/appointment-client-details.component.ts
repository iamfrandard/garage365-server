import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Appointment } from 'src/app/models/appointment.model';
import { Search } from 'src/app/models/search.model';
import { AppointmentClientService } from 'src/app/services/appointmentClient.service';
import { SearchServiceComponent } from 'src/app/services/search.service';
import { StorageServiceComponent } from 'src/app/services/storage.service';

@Component({
  selector: 'app-appointment-client-details',
  templateUrl: './appointment-client-details.component.html',
  styleUrls: ['./appointment-client-details.component.css'],
})
export class AppointmentClientDetailsComponent {
  Locations = '';
  Services = '';
  Alert = false;
  commentValue: string = '';
  isPriorityService: boolean = false;
  reviews: any[] = [];
  averageRating: number = 0;
  workshopId: string = '651d03d9d3b0971b0c3d8fbf';

  currentSlide = 0;
  autoSlideInterval: any;

  _Appointment: Appointment = {
    UserID: '',
    Workshop: '',
    Schedule: '',
    Location: '',
    Service: '',
    Status: '',
    Bill: '',
    Confirm: false,
    Comment: '',
    PriorityService: false,
  };
  submitted = false;
  workshops: any;

  @Input() viewMode = true;

  @Input() Appointment: Appointment = {
    UserID: '',
    Workshop: '',
    Schedule: '',
    Status: '',
    Bill: '',
    Confirm: false,
    Comment: '',
    PriorityService: false,
  };

  @Input() Workshop: Search = {
    WorkshopName: '',
    vehicleBrand: '',
    phoneNumber: '',
    email: '',
    address: '',
    address2: '',
    province: '',
    city: '',
    sector: '',
  };

  message = '';

  constructor(
    private _AppointmentClientService: AppointmentClientService,
    private _SearchService: SearchServiceComponent,
    private route: ActivatedRoute,
    private _StorageService: StorageServiceComponent
  ) {}

  direcciones: any[] = [];
  servicios: any[] = [];
  CurrentUser = '';
  CurrentUser2 = '';
  Role = 'ROLE_USER';

  ngOnInit(): void {
    this.message = '';
    this.getTutorial(this.route.snapshot.params['id']);
    this.CurrentUser = this._StorageService.getUser().id;
    this.CurrentUser2 = this._StorageService.getUser().roles;
    this.fetchReviews();
    this.autoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.autoSlideInterval);
}

  getTutorial(id: string): void {
    this._SearchService.get(id).subscribe({
      next: (data) => {
        this.Workshop = data;

        this._SearchService.getDirecciones(id).subscribe(
          (direccionesData) => {
            this.direcciones = direccionesData.locations;
          },
          (error) => {
            console.error('Error al obtener las direcciones:', error);
          }
        );

        this._SearchService.getServicios(id).subscribe(
          (serviciosData) => {
            this.servicios = serviciosData.vehicleService;
          },
          (error) => {
            console.error('Error al obtener los servicios:', error);
          }
        );
      },
      error: (e) => console.error(e),
    });
  }

  updatePublished(status: boolean): void {
    const data = {
      Schedule: this.Appointment.Schedule,
    };

    this.message = '';

    this._AppointmentClientService.update(this.Appointment.id, data).subscribe({
      next: (res) => {
        this.Appointment.Confirm = status;
        this.message = res.message
          ? res.message
          : 'The status was updated successfully!';
      },
      error: (e) => console.error(e),
    });
  }

  updateTutorial(): void {
    this.message = '';

    this._AppointmentClientService
      .update(this.Appointment.id, this.Appointment)
      .subscribe({
        next: (res) => {
          this.message = res.message
            ? res.message
            : 'This tutorial was updated successfully!';
        },
        error: (e) => console.error(e),
      });
  }

  saveTutorial(): void {
    const data = {
      UserID: this.CurrentUser,
      Workshop: this.Workshop.WorkshopName,
      Schedule: this._Appointment.Schedule,
      Location: this.Locations,
      Service: this.Services,
      Comment: this.commentValue,
      PriorityService: this.isPriorityService,
    };

    this.Alert = true;

    this._AppointmentClientService.create(data).subscribe({
      next: (res) => {
        this.submitted = true;
      },
      error: (e) => console.error(e),
    });
  }

  newTutorial(): void {
    this.submitted = false;
    this._Appointment = {
      UserID: '',
      Workshop: '',
      Schedule: '',
      Status: '',
      Bill: '',
      Confirm: false,
    };
  }

  getWorkshopList() {
    this._AppointmentClientService.getWorkshopList().subscribe((data) => {
      this.workshops = data;
    });
  }

  fetchReviews(): void {
    this._AppointmentClientService.getReviews(this.workshopId).subscribe(data => {
      this.reviews = data;
      const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
      this.averageRating = this.reviews.length ? totalRating / this.reviews.length : 0;
    }, error => {
      console.error('Error fetching reviews:', error);
    });
  }

  autoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
        this.nextSlide();
    }, 3000); // Cada 3 segundos
  }

  previousSlide(): void {
      if (this.currentSlide > 0) {
          this.currentSlide--;
      } else {
          this.currentSlide = this.reviews.length - 1; // Regresar al último comentario
      }
  }

  nextSlide(): void {
      if (this.currentSlide < this.reviews.length - 1) {
          this.currentSlide++;
      } else {
          this.currentSlide = 0; // Regresar al primer comentario
      }
  }
  
  schedule = [
    { day: 'Lunes', timeStart: 9, timeFinish: 17 },
    { day: 'Martes', timeStart: 10, timeFinish: 18 },
    { day: 'Miércoles', timeStart: 8, timeFinish: 16 },
    { day: 'Jueves', timeStart: 11, timeFinish: 19 },
    { day: 'Viernes', timeStart: 7, timeFinish: 15 }
];

  // Convertir días de la semana a índice numérico
  private dayToIndex: { [key: string]: number } = {
    'Domingo': 0,
    'Lunes': 1,
    'Martes': 2,
    'Miércoles': 3,
    'Jueves': 4,
    'Viernes': 5,
    'Sábado': 6,
};

  // Función para obtener el límite mínimo y máximo basado en la fecha actual
  getDateTimeLimits() {
    if (!this.schedule || this.schedule.length === 0) return;
  
    const today = new Date();
    const dayName = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const todayName = dayName[today.getDay()];
  
    const todaySchedule = this.schedule.find(s => s.day === todayName);
  
    if (!todaySchedule) return;
  
    const min = new Date(today);
    min.setHours(todaySchedule.timeStart, 0, 0, 0); 
  
    const max = new Date(today);
    max.setHours(todaySchedule.timeFinish, 0, 0, 0);
  
    return {
      min: min.toISOString().slice(0,16),
      max: max.toISOString().slice(0,16)
    };
  }

  validateDate() {
    const inputDate = document.getElementById("appointmentDate");
    
    if (inputDate && inputDate instanceof HTMLInputElement) {
      const selectedDate = new Date(inputDate.value);
      const dayOfWeek = selectedDate.getDay();
  
      // Aquí estableces tus días permitidos. Ejemplo: 1 representa lunes y 5 representa viernes.
      const allowedDays = [1, 2, 3, 4, 5];
  
      if (!allowedDays.includes(dayOfWeek)) {
        alert('El día seleccionado no está permitido.');
        inputDate.value = '';  // Limpiar la fecha si no es válida
      }
    } else {
      console.error("El elemento inputDate no se encontró o no es un input válido.");
    }
  }
  
  
}
