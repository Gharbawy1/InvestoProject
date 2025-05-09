/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BusinessForCurrentService } from './business-for-current.service';

describe('Service: BusinessForCurrent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusinessForCurrentService]
    });
  });

  it('should ...', inject([BusinessForCurrentService], (service: BusinessForCurrentService) => {
    expect(service).toBeTruthy();
  }));
});
