import { TestBed } from '@angular/core/testing';

import { UserMetaService } from './user-meta.service';

describe('UserMetaService', () => {
  let service: UserMetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
