import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrdonnanceAdminComponent } from './edit-ordonnance-admin.component';

describe('EditOrdonnanceAdminComponent', () => {
  let component: EditOrdonnanceAdminComponent;
  let fixture: ComponentFixture<EditOrdonnanceAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditOrdonnanceAdminComponent]
    });
    fixture = TestBed.createComponent(EditOrdonnanceAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
