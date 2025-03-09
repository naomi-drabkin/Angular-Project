import { TestBed } from '@angular/core/testing';

import { ApiCoursesService } from './api-courses.service';

describe('ApiCoursesService', () => {
  let service: ApiCoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiCoursesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
