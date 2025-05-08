import {Component, Input} from '@angular/core';
import {Dato} from "./dato";
import {JsonPipe} from "@angular/common";

@Component({
    selector: 'app-propiedades',
    imports: [
        JsonPipe
    ],
    templateUrl: './propiedades.component.html',
    styleUrl: './propiedades.component.sass'
})
export class PropiedadesComponent {

  @Input() parametro?: string = "Por defecto";
  @Input() parametro2?: number = 0;
  @Input() dato?: Dato = new Dato("Por defecto");
  @Input() objeto?: any = { prop: "Valor por defecto" };
}
