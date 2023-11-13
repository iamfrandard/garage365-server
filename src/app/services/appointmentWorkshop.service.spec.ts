import { TestBed } from '@angular/core/testing';

import { AppointmentWorkshopService } from './appointmentWorkshop.service';

describe('AppointmentWorkshopService', () => {
  let service: AppointmentWorkshopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentWorkshopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
