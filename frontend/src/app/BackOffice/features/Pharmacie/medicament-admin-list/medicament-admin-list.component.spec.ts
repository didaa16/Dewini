import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentAdminListComponent } from './medicament-admin-list.component';

describe('MedicamentAdminListComponent', () => {
  let component: MedicamentAdminListComponent;
  let fixture: ComponentFixture<MedicamentAdminListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicamentAdminListComponent]
    });
    fixture = TestBed.createComponent(MedicamentAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
