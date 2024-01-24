import { Component } from '@angular/core';
import {CurrencyPipe, DatePipe, JsonPipe, LowerCasePipe, PercentPipe, UpperCasePipe} from "@angular/common";
import {MiaDirective} from "../directives/mia.directive";

@Component({
  selector: 'app-uso-pipes',
  standalone: true,
  imports: [
    LowerCasePipe,
    UpperCasePipe,
    JsonPipe,
    PercentPipe,
    CurrencyPipe,
    DatePipe,
    MiaDirective
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

  fecha: Date = new Date();
  // fecha: Date = new Date(2023, 6, 15, 12, 30, 15);
}
