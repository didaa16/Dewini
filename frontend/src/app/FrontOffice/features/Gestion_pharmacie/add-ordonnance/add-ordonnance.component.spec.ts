import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrdonnanceComponent } from './add-ordonnance.component';

describe('AddOrdonnanceComponent', () => {
  let component: AddOrdonnanceComponent;
  let fixture: ComponentFixture<AddOrdonnanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddOrdonnanceComponent]
    });
    fixture = TestBed.createComponent(AddOrdonnanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
