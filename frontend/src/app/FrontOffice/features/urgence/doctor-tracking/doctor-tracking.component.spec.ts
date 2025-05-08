import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorTrackingComponent } from './doctor-tracking.component';

describe('DoctorTrackingComponent', () => {
  let component: DoctorTrackingComponent;
  let fixture: ComponentFixture<DoctorTrackingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctorTrackingComponent]
    });
    fixture = TestBed.createComponent(DoctorTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
