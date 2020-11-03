import { TestBed } from '@angular/core/testing';

import { MyPlacesService } from './my-places.service';

describe('MyPlacesService', () => {
  let service: MyPlacesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyPlacesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
