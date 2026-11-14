import { Component, ChangeDetectionStrategy } from '@angular/core';
import {PropiedadesComponent} from "../../components/propiedades/propiedades.component";
import {Dato} from "../../components/propiedades/dato";

@Component({
    selector: 'app-props-page',
    imports: [
        PropiedadesComponent
    ],
    templateUrl: './props-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './props-page.component.css'
})
export class PropsPageComponent {
  objetoDato: Dato = new Dato("holiwi")
  objetoCualquiera: any = { prop: "Valor"}
}
