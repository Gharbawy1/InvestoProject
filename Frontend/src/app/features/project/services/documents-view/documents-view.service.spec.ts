/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DocumentsViewService } from './documents-view.service';

describe('Service: DocumentsView', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentsViewService]
    });
  });

  it('should ...', inject([DocumentsViewService], (service: DocumentsViewService) => {
    expect(service).toBeTruthy();
  }));
});
