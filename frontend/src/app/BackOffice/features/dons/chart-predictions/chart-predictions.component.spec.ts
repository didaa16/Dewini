import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartPredictionsComponent } from './chart-predictions.component';

describe('ChartPredictionsComponent', () => {
  let component: ChartPredictionsComponent;
  let fixture: ComponentFixture<ChartPredictionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartPredictionsComponent]
    });
    fixture = TestBed.createComponent(ChartPredictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
