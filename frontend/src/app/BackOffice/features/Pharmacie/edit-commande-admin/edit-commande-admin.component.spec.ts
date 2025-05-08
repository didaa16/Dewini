import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommandeAdminComponent } from './edit-commande-admin.component';

describe('EditCommandeAdminComponent', () => {
  let component: EditCommandeAdminComponent;
  let fixture: ComponentFixture<EditCommandeAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCommandeAdminComponent]
    });
    fixture = TestBed.createComponent(EditCommandeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
