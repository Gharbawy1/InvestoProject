/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { AccountService } from './Account.service';

describe('Service: AccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountService],
    });
  });

  it('should ...', inject(
    [AccountService],
    (service: AccountService) => {
      expect(service).toBeTruthy();
    }
  ));
});
