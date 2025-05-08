import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMedicamentComponent } from './edit-medicament.component';

describe('EditMedicamentComponent', () => {
  let component: EditMedicamentComponent;
  let fixture: ComponentFixture<EditMedicamentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMedicamentComponent]
    });
    fixture = TestBed.createComponent(EditMedicamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
