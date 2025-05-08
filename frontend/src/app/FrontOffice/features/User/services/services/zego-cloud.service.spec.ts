import { TestBed } from '@angular/core/testing';

import { ZegoCloudService } from './zego-cloud.service';

describe('ZegoCloudService', () => {
  let service: ZegoCloudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZegoCloudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
