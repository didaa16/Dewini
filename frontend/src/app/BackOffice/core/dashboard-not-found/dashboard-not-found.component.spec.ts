import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNotFoundComponent } from './dashboard-not-found.component';

describe('DashboardNotFoundComponent', () => {
  let component: DashboardNotFoundComponent;
  let fixture: ComponentFixture<DashboardNotFoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardNotFoundComponent]
    });
    fixture = TestBed.createComponent(DashboardNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
