import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentWorkshopListComponent } from './appointment-workshop-list.component';

describe('AppointmentWorkshopListComponent', () => {
  let component: AppointmentWorkshopListComponent;
  let fixture: ComponentFixture<AppointmentWorkshopListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentWorkshopListComponent]
    });
    fixture = TestBed.createComponent(AppointmentWorkshopListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
