import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppelDonneursComponent } from './appel-donneurs.component';

describe('AppelDonneursComponent', () => {
  let component: AppelDonneursComponent;
  let fixture: ComponentFixture<AppelDonneursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppelDonneursComponent]
    });
    fixture = TestBed.createComponent(AppelDonneursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
