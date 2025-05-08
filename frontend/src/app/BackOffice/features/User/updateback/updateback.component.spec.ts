import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatebackComponent } from './updateback.component';

describe('UpdatebackComponent', () => {
  let component: UpdatebackComponent;
  let fixture: ComponentFixture<UpdatebackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatebackComponent]
    });
    fixture = TestBed.createComponent(UpdatebackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
