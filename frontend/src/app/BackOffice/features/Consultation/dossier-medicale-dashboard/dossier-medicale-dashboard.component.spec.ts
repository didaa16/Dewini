import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierMedicaleDashboardComponent } from './dossier-medicale-dashboard.component';

describe('DossierMedicaleDashboardComponent', () => {
  let component: DossierMedicaleDashboardComponent;
  let fixture: ComponentFixture<DossierMedicaleDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DossierMedicaleDashboardComponent]
    });
    fixture = TestBed.createComponent(DossierMedicaleDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
