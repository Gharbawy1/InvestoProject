import { TestBed } from '@angular/core/testing';

import { BusinessApprovalService } from './business-approval.service';

describe('BusinessApprovalService', () => {
  let service: BusinessApprovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessApprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
