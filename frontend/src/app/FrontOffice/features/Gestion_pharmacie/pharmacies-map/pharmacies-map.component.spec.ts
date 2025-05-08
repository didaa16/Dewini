import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmaciesMapComponent } from './pharmacies-map.component';

describe('PharmaciesMapComponent', () => {
  let component: PharmaciesMapComponent;
  let fixture: ComponentFixture<PharmaciesMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PharmaciesMapComponent]
    });
    fixture = TestBed.createComponent(PharmaciesMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
