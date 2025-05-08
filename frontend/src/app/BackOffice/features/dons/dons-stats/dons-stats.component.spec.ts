import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonsStatsComponent } from './dons-stats.component';

describe('DonsStatsComponent', () => {
  let component: DonsStatsComponent;
  let fixture: ComponentFixture<DonsStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonsStatsComponent]
    });
    fixture = TestBed.createComponent(DonsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
