import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationComponent } from './participation.component';

describe('ParticipationComponent', () => {
  let component: ParticipationComponent;
  let fixture: ComponentFixture<ParticipationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipationComponent]
    });
    fixture = TestBed.createComponent(ParticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
