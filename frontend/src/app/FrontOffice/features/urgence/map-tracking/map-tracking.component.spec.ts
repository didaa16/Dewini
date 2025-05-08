import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTrackingComponent } from './map-tracking.component';

describe('MapTrackingComponent', () => {
  let component: MapTrackingComponent;
  let fixture: ComponentFixture<MapTrackingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapTrackingComponent]
    });
    fixture = TestBed.createComponent(MapTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
