import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMedicamentAdminComponent } from './edit-medicament-admin.component';

describe('EditMedicamentAdminComponent', () => {
  let component: EditMedicamentAdminComponent;
  let fixture: ComponentFixture<EditMedicamentAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMedicamentAdminComponent]
    });
    fixture = TestBed.createComponent(EditMedicamentAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
