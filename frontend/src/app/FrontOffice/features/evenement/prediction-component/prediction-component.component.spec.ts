import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionComponentComponent } from './prediction-component.component';

describe('PredictionComponentComponent', () => {
  let component: PredictionComponentComponent;
  let fixture: ComponentFixture<PredictionComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PredictionComponentComponent]
    });
    fixture = TestBed.createComponent(PredictionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
