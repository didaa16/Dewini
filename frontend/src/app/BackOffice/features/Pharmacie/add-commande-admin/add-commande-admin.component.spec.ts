import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommandeAdminComponent } from './add-commande-admin.component';

describe('AddCommandeAdminComponent', () => {
  let component: AddCommandeAdminComponent;
  let fixture: ComponentFixture<AddCommandeAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCommandeAdminComponent]
    });
    fixture = TestBed.createComponent(AddCommandeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
