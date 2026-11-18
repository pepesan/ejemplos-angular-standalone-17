import { Component, ChangeDetectionStrategy } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {EnunciadoComponent} from "../enunciado/enunciado.component";

@Component({
  selector: 'app-ejercicio-eventos',
  imports: [
    FormsModule,
    EnunciadoComponent
  ],
  templateUrl: './ejercicio-eventos.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ejercicio-eventos.component.css'
})
export class EjercicioEventosComponent {

  // `[(ngModel)]` mantiene esta propiedad sincronizada con el campo del formulario.
  nombre: string = '';

  // Estos manejadores permiten comparar eventos de clic y de puntero en la plantilla.
  saludoBueno(): void {
    console.log('buenos días');
  }

  mouseOverBueno(): void {
    console.log('jijiji');
  }

  saludoFeo(): void {
    console.log('y tu que miras!');
  }

  saludoMalo(): void {
    console.log('te vas a cagar!');
  }

  // Compara dos accesos al mismo dato: el modelo de ngModel y la referencia local del input.
  onSubmit(event: SubmitEvent, valor: string): void {
    event.preventDefault();
    console.log('Valor del campo "nombre":', this.nombre);
    console.log('Valor del campo "nombre":', valor);
  }

  // Regla didáctica al salir del campo; solo informa por consola, no valida el envío del formulario.
  onBlurNombre($event: Event): void {
    // `EventTarget` es genérico; el cast permite leer la propiedad `value` del input.
    let elemento = $event.target as HTMLInputElement;
    console.log("valor del campo: " + elemento.value);
    if (this.nombre.trim().length >= 5) {
      console.log('El campo valida');
    }else {
      console.log('El campo no valida');
    }
  }

}
