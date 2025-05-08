import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantListComponent } from './participant-list.component';

describe('ParticipantListComponent', () => {
  let component: ParticipantListComponent;
  let fixture: ComponentFixture<ParticipantListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantListComponent]
    });
    fixture = TestBed.createComponent(ParticipantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
