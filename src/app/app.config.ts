import {ApplicationConfig, LOCALE_ID} from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptors, withXhr} from "@angular/common/http";
import { routes } from './app.routes';
import { globalHttpErrorInterceptor } from './interceptors/global-http-error.interceptor';
import { jwtAuthInterceptor } from './interceptors/jwt-auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withXhr(), withInterceptors([jwtAuthInterceptor, globalHttpErrorInterceptor])),
    // configuración del Locale global
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ]

};
