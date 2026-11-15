import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiErrorService } from '../services/api-error.service';

export const globalHttpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const errors = inject(ApiErrorService);
  return next(request).pipe(
    catchError((error: unknown) => {
      errors.report(error);
      // El interceptor informa globalmente y conserva el error para que el componente también pueda reaccionar.
      return throwError(() => error);
    }),
  );
};
