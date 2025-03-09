import { TestBed } from '@angular/core/testing';

import { LessonsService } from './lessons.service';

describe('LessonsService', () => {
  let service: ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
