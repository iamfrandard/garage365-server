import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyAccountEComponent } from './verify-accountE.component';

describe('VerifyAccountEComponent', () => {
  let component: VerifyAccountEComponent;
  let fixture: ComponentFixture<VerifyAccountEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyAccountEComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyAccountEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
