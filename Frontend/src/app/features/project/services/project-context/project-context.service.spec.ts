/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { ProjectContextService } from './project-context.service';

describe('Service: ProjectContext', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectContextService],
    });
  });

  it('should ...', inject(
    [ProjectContextService],
    (service: ProjectContextService) => {
      expect(service).toBeTruthy();
    }
  ));
});
