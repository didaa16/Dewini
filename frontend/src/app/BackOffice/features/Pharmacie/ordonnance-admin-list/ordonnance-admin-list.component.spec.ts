import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdonnanceAdminListComponent } from './ordonnance-admin-list.component';

describe('OrdonnanceAdminListComponent', () => {
  let component: OrdonnanceAdminListComponent;
  let fixture: ComponentFixture<OrdonnanceAdminListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdonnanceAdminListComponent]
    });
    fixture = TestBed.createComponent(OrdonnanceAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
