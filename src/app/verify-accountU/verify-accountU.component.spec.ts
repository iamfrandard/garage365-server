import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyAccountUComponent } from './verify-accountU.component';

describe('VerifyAccountUComponent', () => {
  let component: VerifyAccountUComponent;
  let fixture: ComponentFixture<VerifyAccountUComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyAccountUComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyAccountUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
