import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadOrdonnanceComponent } from './upload-ordonnance.component';

describe('UploadOrdonnanceComponent', () => {
  let component: UploadOrdonnanceComponent;
  let fixture: ComponentFixture<UploadOrdonnanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadOrdonnanceComponent]
    });
    fixture = TestBed.createComponent(UploadOrdonnanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
