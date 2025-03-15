/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GoogleSigninService } from './google-signin.service';

describe('Service: GoogleSignin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleSigninService]
    });
  });

  it('should ...', inject([GoogleSigninService], (service: GoogleSigninService) => {
    expect(service).toBeTruthy();
  }));
});
