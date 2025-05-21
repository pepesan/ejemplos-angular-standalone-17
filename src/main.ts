import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// 1. Registra el locale en el bundle
registerLocaleData(localeEs, 'es-ES');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
