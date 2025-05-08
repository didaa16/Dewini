import { TestBed } from '@angular/core/testing';

import { PlanningService } from './planning-service.service';

describe('PlanningServiceService', () => {
  let service: PlanningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
