import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {BasicoService} from "../../services/basico.service";
import {RouterLink} from "@angular/router";
import {AvisoApiComponent} from "../aviso-api/aviso-api.component";

@Component({
  selector: 'app-uso-servicio-basico',
  imports: [AvisoApiComponent, RouterLink],
  // Sin `providers`: `@Service()` ya registra el servicio en el inyector raíz (singleton de toda la app).
  // Si lo declaráramos aquí, este componente tendría su PROPIA instancia y dejaría de ser singleton.
  templateUrl: './uso-servicio-basico.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uso-servicio-basico.component.css'
})
export class UsoServicioBasicoComponent {

  // `inject()` pide al inyector el servicio. Aquí es un inicializador de campo, que es un contexto de
  // inyección válido. La alternativa clásica es la inyección por constructor (ver `v2/servicio-injectable`).
  private readonly miServicio = inject(BasicoService);

  public propiedadVisible: string = this.miServicio.propiedad;
  public propiedadCargada: string = this.miServicio.getData();

  constructor() {
    console.log('UsoServicioBasicoComponent');
  }

}
