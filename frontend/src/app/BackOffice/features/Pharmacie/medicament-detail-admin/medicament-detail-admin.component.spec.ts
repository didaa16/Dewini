import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentDetailAdminComponent } from './medicament-detail-admin.component';

describe('MedicamentDetailAdminComponent', () => {
  let component: MedicamentDetailAdminComponent;
  let fixture: ComponentFixture<MedicamentDetailAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicamentDetailAdminComponent]
    });
    fixture = TestBed.createComponent(MedicamentDetailAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
