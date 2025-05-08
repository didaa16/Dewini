import { TestBed } from '@angular/core/testing';

import { FatigueService } from './fatigue.service';

describe('FatigueService', () => {
  let service: FatigueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FatigueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
