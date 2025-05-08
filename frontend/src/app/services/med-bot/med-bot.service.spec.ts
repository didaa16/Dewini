import { TestBed } from '@angular/core/testing';

import { MedBotService } from './med-bot.service';

describe('MedBotService', () => {
  let service: MedBotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedBotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
