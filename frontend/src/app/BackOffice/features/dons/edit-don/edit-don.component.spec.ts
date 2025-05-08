import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDonComponent } from './edit-don.component';

describe('EditDonComponent', () => {
  let component: EditDonComponent;
  let fixture: ComponentFixture<EditDonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDonComponent]
    });
    fixture = TestBed.createComponent(EditDonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
