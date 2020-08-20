import { TestBed } from '@angular/core/testing';

import { SubjectCommentsService } from './subject-comments.service';

describe('SubjectCommentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubjectCommentsService = TestBed.get(SubjectCommentsService);
    expect(service).toBeTruthy();
  });
});
