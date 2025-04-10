import { Component } from '@angular/core';
import {BasicoService} from "../../services/basico.service";

@Component({
  selector: 'app-uso-servicio-basico',
  imports: [],
  templateUrl: './uso-servicio-basico.component.html',
  styleUrl: './uso-servicio-basico.component.css'
})
export class UsoServicioBasicoComponent {

  // propiedad para usarla en la plantilla
  public propiedadVisible: string;
  // propiedad cargada desde método de servicio
  public propiedadCargada: string;

  constructor(private miServicio: BasicoService) {
    console.log('UsoServicioBasicoComponent');
    // pasamos el dato del servicio al componente
    this.propiedadVisible = this.miServicio.propiedad;
    // pasamos desde el método del servicio a la propiedad
    this.propiedadCargada = this.miServicio.getData();
  }

}
