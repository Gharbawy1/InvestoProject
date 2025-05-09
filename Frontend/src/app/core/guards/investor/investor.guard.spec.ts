import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { investorGuard } from './investor.guard';

describe('investorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => investorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
