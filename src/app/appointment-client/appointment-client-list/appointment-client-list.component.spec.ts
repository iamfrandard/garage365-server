import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentClientListComponent } from './appointment-client-list.component';

describe('AppointmentClientListComponent', () => {
  let component: AppointmentClientListComponent;
  let fixture: ComponentFixture<AppointmentClientListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentClientListComponent]
    });
    fixture = TestBed.createComponent(AppointmentClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
