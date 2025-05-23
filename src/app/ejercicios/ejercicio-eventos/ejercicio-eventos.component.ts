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
  onSubmit(event: SubmitEvent, valor: string): void {
    event.preventDefault();
    // se puede coger desde el ngmodel el valor del campo
    console.log('Valor del campo "nombre":', this.nombre);
    // o desde el parametro del evento
    console.log('Valor del campo "nombre":', valor);
  }

  // Función que se ejecuta al salir del campo "nombre"; si tiene al menos 5 caracteres, informa que valida
  onBlurNombre($event: Event): void {
    // $event es el evento de salida del campo
    // Se puede usar el operador "as" para convertir $event.target a un tipo específico de elemento html
    let elemento = $event.target as HTMLInputElement;
    console.log("valor del campo: " + elemento.value);
    // Se puede pillar del ngModel el valor del campo
    if (this.nombre.trim().length >= 5) {
      console.log('El campo valida');
    }else {
      console.log('El campo no valida');
    }
  }

}
