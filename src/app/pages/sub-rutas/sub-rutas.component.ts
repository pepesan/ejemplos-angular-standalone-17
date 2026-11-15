import { Component, ChangeDetectionStrategy } from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
    selector: 'app-sub-rutas',
    imports: [
        RouterLink,
        RouterOutlet
    ],
    templateUrl: './sub-rutas.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './sub-rutas.component.css'
})
export class SubRutasComponent {

}
