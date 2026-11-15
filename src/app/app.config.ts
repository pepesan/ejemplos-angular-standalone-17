import {ApplicationConfig, LOCALE_ID} from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withXhr} from "@angular/common/http";
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withXhr()),
    // configuración del Locale global
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ]

};
