import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReponseAdminComponent } from './list-reponse-admin.component';

describe('ListReponseAdminComponent', () => {
  let component: ListReponseAdminComponent;
  let fixture: ComponentFixture<ListReponseAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListReponseAdminComponent]
    });
    fixture = TestBed.createComponent(ListReponseAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
