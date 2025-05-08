import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFatigueComponent } from './test-fatigue.component';

describe('TestFatigueComponent', () => {
  let component: TestFatigueComponent;
  let fixture: ComponentFixture<TestFatigueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestFatigueComponent]
    });
    fixture = TestBed.createComponent(TestFatigueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
