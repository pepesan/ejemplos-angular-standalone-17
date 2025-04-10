import { Component } from '@angular/core';
import {MiService} from "./mi.service";

@Component({
  selector: 'app-ejercicio-servicios',
  imports: [],
  templateUrl: './ejercicio-servicios.component.html',
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
