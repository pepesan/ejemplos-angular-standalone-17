import {Component, Input} from '@angular/core';
import {Dato} from "./dato";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-ejercicio-input-llamado',
  imports: [
    JsonPipe
  ],
  templateUrl: './ejercicio-input-llamado.component.html',
  styleUrl: './ejercicio-input-llamado.component.css'
})
export class EjercicioInputLlamadoComponent {
  @Input() cadena?: string;
  @Input() numero?: number;
  @Input() objeto?: Dato;

}
