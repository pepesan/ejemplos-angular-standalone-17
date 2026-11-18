import { Component, ChangeDetectionStrategy } from '@angular/core';
import {PropiedadesComponent} from "../../components/propiedades/propiedades.component";
import {Dato} from "../../components/propiedades/dato";

import {AvisoApiComponent} from "../../components/aviso-api/aviso-api.component";
@Component({
    selector: 'app-props-page',
    imports: [
    PropiedadesComponent,
    AvisoApiComponent
  ],
    templateUrl: './props-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './props-page.component.css'
})
export class PropsPageComponent {
  objetoDato: Dato = new Dato("holiwi")
  objetoCualquiera: any = { prop: "Valor"}
}
