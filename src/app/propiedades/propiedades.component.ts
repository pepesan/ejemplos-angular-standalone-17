import {Component, Input} from '@angular/core';
import {Dato} from "./dato";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-propiedades',
  standalone: true,
  imports: [
    JsonPipe
  ],
  templateUrl: './propiedades.component.html',
  styleUrl: './propiedades.component.sass'
})
export class PropiedadesComponent {

  @Input() parametro?: string;
  @Input() parametro2?: number;
  @Input() dato?: Dato;
 }
