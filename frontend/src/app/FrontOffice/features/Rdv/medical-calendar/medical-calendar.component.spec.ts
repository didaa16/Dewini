import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalCalendarComponent } from './medical-calendar.component';

describe('MedicalCalendarComponent', () => {
  let component: MedicalCalendarComponent;
  let fixture: ComponentFixture<MedicalCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalCalendarComponent]
    });
    fixture = TestBed.createComponent(MedicalCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
