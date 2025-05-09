import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { businessGuard } from './business.guard';

describe('businessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => businessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
