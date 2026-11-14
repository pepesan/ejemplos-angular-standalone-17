import { Component, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-ejercicio-condicionales',
  imports: [],
  templateUrl: './ejercicio-condicionales.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ejercicio-condicionales.component.css'
})
export class EjercicioCondicionalesComponent {
  presenta: boolean = true;

  cambia() {
    this.presenta = !this.presenta;
  }
}
