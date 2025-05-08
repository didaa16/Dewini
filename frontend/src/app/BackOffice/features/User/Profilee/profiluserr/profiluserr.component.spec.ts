import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiluserrComponent } from './profiluserr.component';

describe('ProfiluserrComponent', () => {
  let component: ProfiluserrComponent;
  let fixture: ComponentFixture<ProfiluserrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfiluserrComponent]
    });
    fixture = TestBed.createComponent(ProfiluserrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
