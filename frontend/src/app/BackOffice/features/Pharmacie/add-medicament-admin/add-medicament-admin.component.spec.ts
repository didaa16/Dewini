import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicamentAdminComponent } from './add-medicament-admin.component';

describe('AddMedicamentAdminComponent', () => {
  let component: AddMedicamentAdminComponent;
  let fixture: ComponentFixture<AddMedicamentAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMedicamentAdminComponent]
    });
    fixture = TestBed.createComponent(AddMedicamentAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
