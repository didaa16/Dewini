import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeAdminListComponent } from './commande-admin-list.component';

describe('CommandeAdminListComponent', () => {
  let component: CommandeAdminListComponent;
  let fixture: ComponentFixture<CommandeAdminListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommandeAdminListComponent]
    });
    fixture = TestBed.createComponent(CommandeAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
