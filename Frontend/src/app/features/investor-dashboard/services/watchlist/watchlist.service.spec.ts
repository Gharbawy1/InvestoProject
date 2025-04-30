import { TestBed } from '@angular/core/testing';

import { WatchlistService } from './watchlist.service';

describe('WatchlistServiceService', () => {
  let service: WatchlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
