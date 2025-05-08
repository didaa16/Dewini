import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiquesMedicamentsComponent } from './statistiques-medicaments.component';

describe('StatistiquesMedicamentsComponent', () => {
  let component: StatistiquesMedicamentsComponent;
  let fixture: ComponentFixture<StatistiquesMedicamentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatistiquesMedicamentsComponent]
    });
    fixture = TestBed.createComponent(StatistiquesMedicamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
