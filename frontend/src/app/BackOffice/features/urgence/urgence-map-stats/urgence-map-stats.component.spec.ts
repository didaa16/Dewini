import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgenceMapStatsComponent } from './urgence-map-stats.component';

describe('UrgenceMapStatsComponent', () => {
  let component: UrgenceMapStatsComponent;
  let fixture: ComponentFixture<UrgenceMapStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UrgenceMapStatsComponent]
    });
    fixture = TestBed.createComponent(UrgenceMapStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
