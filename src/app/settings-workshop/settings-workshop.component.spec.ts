import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsWorkshopComponent } from './settings-workshop.component';

describe('SettingsUserComponent', () => {
  let component: SettingsWorkshopComponent;
  let fixture: ComponentFixture<SettingsWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsWorkshopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
