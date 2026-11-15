import { Component, ChangeDetectionStrategy } from '@angular/core';
import {BasicoService} from "../../services/basico.service";

@Component({
  selector: 'app-uso-servicio-basico',
  imports: [],
  templateUrl: './uso-servicio-basico.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uso-servicio-basico.component.css'
})
export class UsoServicioBasicoComponent {

  public propiedadVisible: string;
  public propiedadCargada: string;

  constructor(private miServicio: BasicoService) {
    console.log('UsoServicioBasicoComponent');
    // Comparación didáctica: el dato se lee de una propiedad del servicio.
    this.propiedadVisible = this.miServicio.propiedad;
    // En este caso, el servicio calcula o devuelve el dato mediante un método.
    this.propiedadCargada = this.miServicio.getData();
  }

}
