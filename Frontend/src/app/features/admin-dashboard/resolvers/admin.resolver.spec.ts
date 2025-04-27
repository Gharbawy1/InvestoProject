import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { adminResolver } from './admin.resolver';

describe('adminResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => adminResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
