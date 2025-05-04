import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { IBusinessProfile } from '../interfaces/IBusinessProfile';
import { BusinessApprovalService } from '../services/business-approval.service';

export const adminResolver: ResolveFn<IBusinessProfile[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(BusinessApprovalService).getAllProjects();
};