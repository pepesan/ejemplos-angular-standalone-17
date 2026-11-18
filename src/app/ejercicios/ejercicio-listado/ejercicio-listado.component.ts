import { Component, ChangeDetectionStrategy } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {EnunciadoComponent} from "../enunciado/enunciado.component";

@Component({
  selector: 'app-ejercicio-listado',
  imports: [
    FormsModule,
    EnunciadoComponent
  ],
  templateUrl: './ejercicio-listado.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ejercicio-listado.component.css'
})
export class EjercicioListadoComponent {
  cadena: string = "";
  listado: string[]= ["uno", "dos"];


  addItem() {
    this.listado.push(this.cadena);
    this.cadena = "";
  }
}
