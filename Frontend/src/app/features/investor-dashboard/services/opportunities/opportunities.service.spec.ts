import { TestBed } from '@angular/core/testing';

import { OpportunitiesService } from './opportunities.service';

describe('OpportunitiesServiceTsService', () => {
  let service: OpportunitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpportunitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
