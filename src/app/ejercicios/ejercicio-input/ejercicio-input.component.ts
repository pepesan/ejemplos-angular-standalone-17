import { Component } from '@angular/core';
import {EjercicioInputLlamadoComponent} from "../ejercicio-input-llamado/ejercicio-input-llamado.component";
import {Dato} from "../ejercicio-input-llamado/dato";

@Component({
  selector: 'app-ejercicio-input',
  imports: [
    EjercicioInputLlamadoComponent
  ],
  templateUrl: './ejercicio-input.component.html',
  styleUrl: './ejercicio-input.component.css'
})
export class EjercicioInputComponent {

  miCadena: string = 'valor';
  dato: Dato = new Dato("mi dato");

}
