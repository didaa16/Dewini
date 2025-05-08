import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffichageDonsDashboardComponent } from './affichage-dons-dashboard.component';

describe('AffichageDonsDashboardComponent', () => {
  let component: AffichageDonsDashboardComponent;
  let fixture: ComponentFixture<AffichageDonsDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffichageDonsDashboardComponent]
    });
    fixture = TestBed.createComponent(AffichageDonsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
