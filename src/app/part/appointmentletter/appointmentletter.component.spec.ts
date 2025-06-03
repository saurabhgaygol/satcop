import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentletterComponent } from './appointmentletter.component';

describe('AppointmentletterComponent', () => {
  let component: AppointmentletterComponent;
  let fixture: ComponentFixture<AppointmentletterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentletterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
