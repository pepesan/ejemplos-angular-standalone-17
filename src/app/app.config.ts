import {ApplicationConfig, LOCALE_ID} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {provideHttpClient, withInterceptors, withXhr} from "@angular/common/http";
import { routes } from './app.routes';
import { globalHttpErrorInterceptor } from './interceptors/global-http-error.interceptor';
import { jwtAuthInterceptor } from './interceptors/jwt-auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // `withComponentInputBinding`: parámetros de ruta, query params y datos del resolver llegan a los componentes como `input()`.
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withXhr(), withInterceptors([jwtAuthInterceptor, globalHttpErrorInterceptor])),
    // configuración del Locale global
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ]

};
