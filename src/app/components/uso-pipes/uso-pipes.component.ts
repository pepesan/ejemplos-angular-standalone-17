import { Component } from '@angular/core';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  JsonPipe,
  LowerCasePipe,
  PercentPipe,
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
    styleUrl: './uso-pipes.component.css'
})
export class UsoPipesComponent {
  public cadena: string = "Cadena";
  objetoJSON = {
    id: 1,
    nombre: "Juan",
    apellido: "Perez"
  }
  porcentaje =  0.12;
  numero: number = 2;
  fecha: Date = new Date();
  // fecha: Date = new Date(2023, 6, 15, 12, 30, 15);
}
