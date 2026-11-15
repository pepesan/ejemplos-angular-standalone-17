import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const jwtAuthInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthService).accessToken();
  // Solo añade credenciales a la API local, nunca a peticiones a otros orígenes.
  if (!token || !request.url.startsWith('/api/')) return next(request);

  return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
