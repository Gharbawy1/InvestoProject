/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { UpgradeService } from './Upgrade.service';

describe('Service: UpgradeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpgradeService]
    });
  });

  it('should ...', inject([UpgradeService], (service: UpgradeService) => {
    expect(service).toBeTruthy();
  }));
});
