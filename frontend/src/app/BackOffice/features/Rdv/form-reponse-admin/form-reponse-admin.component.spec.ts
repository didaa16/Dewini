import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReponseAdminComponent } from './form-reponse-admin.component';

describe('FormReponseAdminComponent', () => {
  let component: FormReponseAdminComponent;
  let fixture: ComponentFixture<FormReponseAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormReponseAdminComponent]
    });
    fixture = TestBed.createComponent(FormReponseAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
