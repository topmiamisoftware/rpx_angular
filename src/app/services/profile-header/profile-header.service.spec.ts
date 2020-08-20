import { TestBed } from '@angular/core/testing';

import { ProfileHeaderService } from './profile-header.service';

describe('ProfileHeaderService', () => {
  let service: ProfileHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
