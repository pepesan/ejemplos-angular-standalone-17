import { Component } from '@angular/core';
import {Resultado} from "./resultado";
import {ResultadoService} from "./resultado.service";
import {AsyncPipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-ejercicio-resultado',
  imports: [
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './ejercicio-resultado.component.html',
  styleUrl: './ejercicio-resultado.component.css'
})
export class EjercicioResultadoComponent {

  public listado: Promise<Resultado[]> ;

  constructor(private resultadoService: ResultadoService) {
    // Directamente consultamos al servicio para que devuelva una promesa con los datos del JSON
    this.listado = this.resultadoService.getData().toPromise();
  }


}
