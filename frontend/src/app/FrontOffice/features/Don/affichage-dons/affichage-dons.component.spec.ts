import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffichageDonsComponent } from './affichage-dons.component';

describe('AffichageDonsComponent', () => {
  let component: AffichageDonsComponent;
  let fixture: ComponentFixture<AffichageDonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffichageDonsComponent]
    });
    fixture = TestBed.createComponent(AffichageDonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  
});
