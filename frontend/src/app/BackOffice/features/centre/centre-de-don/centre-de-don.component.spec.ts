import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreDeDonComponent } from './centre-de-don.component';

describe('CentreDeDonComponent', () => {
  let component: CentreDeDonComponent;
  let fixture: ComponentFixture<CentreDeDonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CentreDeDonComponent]
    });
    fixture = TestBed.createComponent(CentreDeDonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
