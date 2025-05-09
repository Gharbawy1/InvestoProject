import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { BusinessDetailsService } from '../services/business-details/business-details.service';
import { map, catchError } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ProjectResolver {
  constructor(
    private businessService: BusinessDetailsService,
    private router: Router,
    private authService: AuthService
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id');
    if (!id) return this.redirectHome();

    return this.businessService.getProjectDetails(id).pipe(
      catchError(() => this.redirectHome()),
      map((data) => {
        if (!data) return null;

        const currentUserId = this.authService.getUserId();
        const isRejected = data.status.toLowerCase() === 'rejected';
        const isOwner = data.ownerId === currentUserId;

        if (isRejected && !isOwner) {
          this.router.navigate(['/']);
          return EMPTY;
        }

        return data;
      })
    );
  }

  private redirectHome() {
    this.router.navigate(['/']);
    return of(null);
  }
}
