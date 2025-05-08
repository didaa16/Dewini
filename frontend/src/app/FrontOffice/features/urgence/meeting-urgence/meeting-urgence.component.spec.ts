import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingUrgenceComponent } from './meeting-urgence.component';

describe('MeetingUrgenceComponent', () => {
  let component: MeetingUrgenceComponent;
  let fixture: ComponentFixture<MeetingUrgenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingUrgenceComponent]
    });
    fixture = TestBed.createComponent(MeetingUrgenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
