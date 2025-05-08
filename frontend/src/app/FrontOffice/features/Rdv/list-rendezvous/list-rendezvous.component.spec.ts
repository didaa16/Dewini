import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRendezvousComponent } from './list-rendezvous.component';

describe('ListRendezvousComponent', () => {
  let component: ListRendezvousComponent;
  let fixture: ComponentFixture<ListRendezvousComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListRendezvousComponent]
    });
    fixture = TestBed.createComponent(ListRendezvousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
