import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgenceStatsComponent } from './urgence-stats.component';

describe('UrgenceStatsComponent', () => {
  let component: UrgenceStatsComponent;
  let fixture: ComponentFixture<UrgenceStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UrgenceStatsComponent]
    });
    fixture = TestBed.createComponent(UrgenceStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
