import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class BusinessOwnerGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const role = this.auth.getCurrentUser()?.role; 
    // or however you expose the JWT role claim

    if (role === 'BusinessOwner') {
      return true;
    }

    // not a business owner? send them somewhere safe:
    this.router.navigate(['/home']);
    return false;
  }
}