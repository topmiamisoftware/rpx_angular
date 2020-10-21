import { TestBed } from '@angular/core/testing';

import { MyFavoritesService } from './my-favorites.service';

describe('MyFavoritesService', () => {
  let service: MyFavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyFavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
