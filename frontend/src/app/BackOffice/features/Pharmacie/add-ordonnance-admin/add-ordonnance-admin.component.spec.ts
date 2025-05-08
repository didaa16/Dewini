import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrdonnanceAdminComponent } from './add-ordonnance-admin.component';

describe('AddOrdonnanceAdminComponent', () => {
  let component: AddOrdonnanceAdminComponent;
  let fixture: ComponentFixture<AddOrdonnanceAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddOrdonnanceAdminComponent]
    });
    fixture = TestBed.createComponent(AddOrdonnanceAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
