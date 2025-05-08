import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCommandeAdminComponent } from './detail-commande-admin.component';

describe('DetailCommandeAdminComponent', () => {
  let component: DetailCommandeAdminComponent;
  let fixture: ComponentFixture<DetailCommandeAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailCommandeAdminComponent]
    });
    fixture = TestBed.createComponent(DetailCommandeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
