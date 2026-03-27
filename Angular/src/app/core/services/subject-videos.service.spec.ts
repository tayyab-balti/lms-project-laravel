import { TestBed } from '@angular/core/testing';

import { SubjectVideosService } from './subject-videos.service';

describe('SubjectVideosService', () => {
  let service: SubjectVideosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectVideosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
