import { TestBed } from '@angular/core/testing';

import { FriendshipsService } from './friendships.service';

describe('FriendshipsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FriendshipsService = TestBed.get(FriendshipsService);
    expect(service).toBeTruthy();
  });
});
