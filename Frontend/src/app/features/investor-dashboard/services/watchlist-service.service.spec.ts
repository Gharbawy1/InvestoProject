import { TestBed } from '@angular/core/testing';

import { WatchlistServiceService } from './watchlist-service.service';

describe('WatchlistServiceService', () => {
  let service: WatchlistServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchlistServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
