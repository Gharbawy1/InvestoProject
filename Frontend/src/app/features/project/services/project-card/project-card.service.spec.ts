import { TestBed } from '@angular/core/testing';

import { ProjectCardService } from './project-card.service';

describe('ProjectCardService', () => {
  let service: ProjectCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
