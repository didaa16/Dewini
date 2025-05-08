import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatefrontofficeComponent } from './templatefrontoffice.component';

describe('TemplatefrontofficeComponent', () => {
  let component: TemplatefrontofficeComponent;
  let fixture: ComponentFixture<TemplatefrontofficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplatefrontofficeComponent]
    });
    fixture = TestBed.createComponent(TemplatefrontofficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
