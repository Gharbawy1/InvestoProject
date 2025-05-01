import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IBusinessDetails } from '../../interfaces/IBusinessDetails';

@Injectable({
  providedIn: 'root',
})
export class ProjectContextService {
  private project$$ = new BehaviorSubject<IBusinessDetails | null>(null);
  readonly project$ = this.project$$.asObservable();

  setProject(p: IBusinessDetails) {
    this.project$$.next(p);
  }
}
