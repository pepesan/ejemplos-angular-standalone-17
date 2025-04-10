import { Component } from '@angular/core';
import {CurrencyPipe, DatePipe, LowerCasePipe, PercentPipe, UpperCasePipe} from "@angular/common";

@Component({
  selector: 'app-ejercicio-tuberias',
  imports: [
    UpperCasePipe,
    LowerCasePipe,
    PercentPipe,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './ejercicio-tuberias.component.html',
  styleUrl: './ejercicio-tuberias.component.css'
})
export class EjercicioTuberiasComponent {
  public titulo: string;
  public numero: number;
  fecha: Date;
    constructor() {
    this.titulo = 'Ejercicio';
    this.numero = 0.25;
    this.fecha = new Date();
  }

}
