import { TestBed } from '@angular/core/testing';

import { MissingPeopleService } from './missing-people.service';

describe('MissingPeopleService', () => {
  let service: MissingPeopleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissingPeopleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
