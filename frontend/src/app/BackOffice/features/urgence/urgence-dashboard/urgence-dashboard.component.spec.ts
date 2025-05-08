import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgenceDashboardComponent } from './urgence-dashboard.component';

describe('UrgenceDashboardComponent', () => {
  let component: UrgenceDashboardComponent;
  let fixture: ComponentFixture<UrgenceDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UrgenceDashboardComponent]
    });
    fixture = TestBed.createComponent(UrgenceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
