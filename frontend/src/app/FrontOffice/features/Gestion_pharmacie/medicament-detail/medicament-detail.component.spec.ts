import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentDetailComponent } from './medicament-detail.component';

describe('MedicamentDetailComponent', () => {
  let component: MedicamentDetailComponent;
  let fixture: ComponentFixture<MedicamentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicamentDetailComponent]
    });
    fixture = TestBed.createComponent(MedicamentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
