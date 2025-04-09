import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-ejercicio-listado',
  imports: [
    FormsModule
  ],
  templateUrl: './ejercicio-listado.component.html',
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
