import { TestBed } from '@angular/core/testing';

import { PlatformStatsService } from './platform-stats.service';

describe('PlatformStatsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlatformStatsService = TestBed.get(PlatformStatsService);
    expect(service).toBeTruthy();
  });
});
