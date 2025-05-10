import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Inject, inject, PLATFORM_ID } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { platform } from 'os';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
