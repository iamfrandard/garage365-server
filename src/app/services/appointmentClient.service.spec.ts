import { TestBed } from '@angular/core/testing';

import { AppointmentClientService } from './appointmentClient.service';

describe('AppointmentClientService', () => {
  let service: AppointmentClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
