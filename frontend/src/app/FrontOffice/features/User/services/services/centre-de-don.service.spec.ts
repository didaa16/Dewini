import { TestBed } from '@angular/core/testing';

import { CentreDeDonService } from './centre-de-don.service';

describe('CentreDeDonService', () => {
  let service: CentreDeDonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentreDeDonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
