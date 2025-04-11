import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-ejercicio-eventos',
  imports: [
    FormsModule
  ],
  templateUrl: './ejercicio-eventos.component.html',
  styleUrl: './ejercicio-eventos.component.css'
})
export class EjercicioEventosComponent {

  // Propiedad vinculada al campo de texto del formulario
  nombre: string = '';

  // Función para el botón "bueno": al hacer clic, muestra "buenos días" en consola
  saludoBueno(): void {
    console.log('buenos días');
  }

  // Función para detectar el evento "mouseover" sobre el botón "bueno"
  mouseOverBueno(): void {
    console.log('jijiji');
  }

  // Función para el botón "feo": al hacer clic, muestra "y tu que miras!" en consola
  saludoFeo(): void {
    console.log('y tu que miras!');
  }

  // Función para el botón "malo": al hacer clic, muestra "te vas a cagar!" en consola
  saludoMalo(): void {
    console.log('te vas a cagar!');
  }

  // Captura el evento submit del formulario y muestra el valor del campo "nombre" en consola
  onSubmit(): void {
    console.log('Valor del campo "nombre":', this.nombre);
  }

  // Función que se ejecuta al salir del campo "nombre"; si tiene al menos 5 caracteres, informa que valida
  onBlurNombre(): void {
    if (this.nombre.trim().length >= 5) {
      console.log('El campo valida');
    }
  }

}
