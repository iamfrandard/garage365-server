import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagementEmployeeComponent } from './management-employee.component';

describe('ManagementEmployeeComponent', () => {
  let component: ManagementEmployeeComponent;
  let fixture: ComponentFixture<ManagementEmployeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementEmployeeComponent]
    });
    fixture = TestBed.createComponent(ManagementEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
