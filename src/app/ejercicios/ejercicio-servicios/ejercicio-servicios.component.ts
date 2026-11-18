import { Component, ChangeDetectionStrategy } from '@angular/core';
import {MiService} from "./mi.service";
import {EnunciadoComponent} from "../enunciado/enunciado.component";

@Component({
  selector: 'app-ejercicio-servicios',
  imports: [
    EnunciadoComponent
  ],
  templateUrl: './ejercicio-servicios.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ejercicio-servicios.component.css'
})
export class EjercicioServiciosComponent {

  public cadena: string;

  public numero: number;

  constructor(private miService: MiService) {
    console.log('EjercicioServiciosComponent');
    this.cadena = this.miService.cadena;
    this.numero = this.miService.getNumero();
  }


}
