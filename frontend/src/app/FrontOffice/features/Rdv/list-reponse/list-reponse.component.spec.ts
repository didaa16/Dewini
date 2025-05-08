import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReponseComponent } from './list-reponse.component';

describe('ListReponseComponent', () => {
  let component: ListReponseComponent;
  let fixture: ComponentFixture<ListReponseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListReponseComponent]
    });
    fixture = TestBed.createComponent(ListReponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
