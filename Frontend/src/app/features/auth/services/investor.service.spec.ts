import { TestBed } from '@angular/core/testing';

import { InvestorService } from './investor.service';

describe('InvestorService', () => {
  let service: InvestorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvestorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
