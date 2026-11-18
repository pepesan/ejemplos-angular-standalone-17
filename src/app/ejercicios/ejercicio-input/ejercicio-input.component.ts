import { Component, ChangeDetectionStrategy } from '@angular/core';
import {EjercicioInputLlamadoComponent} from "../ejercicio-input-llamado/ejercicio-input-llamado.component";
import {Dato} from "../ejercicio-input-llamado/dato";
import {EnunciadoComponent} from "../enunciado/enunciado.component";

import {AvisoApiComponent} from "../../components/aviso-api/aviso-api.component";
@Component({
  selector: 'app-ejercicio-input',
  imports: [
    EjercicioInputLlamadoComponent,
    EnunciadoComponent,
    AvisoApiComponent
  ],
  templateUrl: './ejercicio-input.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ejercicio-input.component.css'
})
export class EjercicioInputComponent {

  miCadena: string = 'valor';
  dato: Dato = new Dato("mi dato");

}
