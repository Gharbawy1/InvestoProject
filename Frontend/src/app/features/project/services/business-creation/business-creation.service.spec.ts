/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BusinessCreationService } from './business-creation.service';

describe('Service: BusinessCreation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusinessCreationService]
    });
  });

  it('should ...', inject([BusinessCreationService], (service: BusinessCreationService) => {
    expect(service).toBeTruthy();
  }));
});
