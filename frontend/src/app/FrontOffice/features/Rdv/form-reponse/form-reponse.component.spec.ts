import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReponseComponent } from './form-reponse.component';

describe('FormReponseComponent', () => {
  let component: FormReponseComponent;
  let fixture: ComponentFixture<FormReponseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormReponseComponent]
    });
    fixture = TestBed.createComponent(FormReponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
