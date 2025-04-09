import { Component } from '@angular/core';
import {Cliente} from "./cliente";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-ejercicio-mis-clientes',
  imports: [
    FormsModule
  ],
  templateUrl: './ejercicio-mis-clientes.component.html',
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
