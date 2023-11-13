import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentClientDetailsComponent } from './appointment-client-details.component';

describe('AppointmentClientDetailsComponent', () => {
  let component: AppointmentClientDetailsComponent;
  let fixture: ComponentFixture<AppointmentClientDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentClientDetailsComponent]
    });
    fixture = TestBed.createComponent(AppointmentClientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
