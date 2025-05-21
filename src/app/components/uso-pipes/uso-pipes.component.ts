import { Component, LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  JsonPipe,
  LowerCasePipe,
  PercentPipe,
  registerLocaleData,
  UpperCasePipe
} from "@angular/common";
import {MiaDirective} from "../../directives/mia.directive";
import {MiPipe} from "../../pipes/mi-pipe.pipe";

@Component({
    selector: 'app-uso-pipes',
    imports: [
        CommonModule,
      /*
        CurrencyPipe,
        DatePipe,
        JsonPipe,
        LowerCasePipe,
        PercentPipe,
        UpperCasePipe,
       */
        MiaDirective,
        MiPipe
    ],
    templateUrl: './uso-pipes.component.html',
    styleUrl: './uso-pipes.component.css',
    // configuración del Locale (para config de la aplicación completa mira main.ts y app.config.ts)
    providers: [
      { provide: LOCALE_ID, useValue: 'es-ES' }
    ],
})


export class UsoPipesComponent {
  public cadena: string = "Cadena";
  objetoJSON = {
    id: 1,
    nombre: "Juan",
    apellido: "Perez"
  }
  porcentaje =  0.12;
  porcentajeDecimales =  0.057987987987;
  numero: number = 2;
  fecha: Date = new Date();
  // fecha: Date = new Date(2023, 6, 15, 12, 30, 15);
  precio = 1234.5;
  constructor() {
    // Registra el locale 'es-ES' en el componente
    registerLocaleData(localeEs, 'es-ES');
  }
}
