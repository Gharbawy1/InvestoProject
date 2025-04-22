import { TestBed } from '@angular/core/testing';

import { ProjectService } from './project-card.service';

describe('ProjectCardService', () => {
  let service: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
