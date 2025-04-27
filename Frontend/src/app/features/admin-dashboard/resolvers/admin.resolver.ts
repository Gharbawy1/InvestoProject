import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { BusinessApprovalService } from '../services/business-approval.service';
import { inject } from '@angular/core';
import { IBusinessProfile } from '../interfaces/IBusinessProfile';

export const adminResolver: ResolveFn<IBusinessProfile[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(BusinessApprovalService).getProjects();
};
