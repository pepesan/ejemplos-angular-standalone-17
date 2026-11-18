import { Component, ChangeDetectionStrategy } from '@angular/core';
import {Cliente} from "./cliente";
import {FormsModule} from "@angular/forms";
import {EnunciadoComponent} from "../enunciado/enunciado.component";

@Component({
  selector: 'app-ejercicio-mis-clientes',
  imports: [
    FormsModule,
    EnunciadoComponent
  ],
  templateUrl: './ejercicio-mis-clientes.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ejercicio-mis-clientes.component.css'
})
export class EjercicioMisClientesComponent {

  cliente: Cliente;
  listado: Cliente[] = [];

  constructor() {
    this.cliente= new Cliente(0, "Antonio", "Córdoba");
    this.listado = [
      new Cliente(1, "Pablo", "Córdoba"),
      new Cliente(2, "Eva", "Santander"),
      new Cliente(3, "César", "Madríz"),
    ];
  }

  addItem() {
    this.listado.push(this.cliente);
    this.cliente = new Cliente();
  }

}
