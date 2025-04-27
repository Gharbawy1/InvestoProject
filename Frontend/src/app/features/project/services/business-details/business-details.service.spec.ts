/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { BusinessDetailsService } from './business-details.service';

describe('Service: BusinessDetails', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusinessDetailsService]
    });
  });

  it('should ...', inject([BusinessDetailsService], (service: BusinessDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
