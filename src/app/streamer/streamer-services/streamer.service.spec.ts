import { TestBed } from '@angular/core/testing';

import { StreamerService } from './streamer.service';

describe('StreamerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StreamerService = TestBed.get(StreamerService);
    expect(service).toBeTruthy();
  });
});
