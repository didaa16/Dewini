import { TestBed } from '@angular/core/testing';

import { IaOcrService } from './ia-ocr.service';

describe('IaOcrService', () => {
  let service: IaOcrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IaOcrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
