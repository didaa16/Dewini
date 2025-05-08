import { TestBed } from '@angular/core/testing';

import { FdaService } from './fda.service';

describe('FdaService', () => {
  let service: FdaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FdaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
