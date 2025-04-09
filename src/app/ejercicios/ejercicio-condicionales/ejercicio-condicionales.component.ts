import { Component } from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-ejercicio-condicionales',
  imports: [
    NgIf
  ],
  templateUrl: './ejercicio-condicionales.component.html',
  styleUrl: './ejercicio-condicionales.component.css'
})
export class EjercicioCondicionalesComponent {
  presenta: boolean = true;
}
