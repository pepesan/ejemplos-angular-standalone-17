import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {AvisoApiComponent} from "../aviso-api/aviso-api.component";
@Component({
  selector: 'app-v2-rutas', standalone: true, imports: [
    RouterLink,
    AvisoApiComponent
  ],
  templateUrl: './v2-rutas.component.html', changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2RutasComponent {
  readonly denegado = inject(ActivatedRoute).snapshot.queryParamMap.has('denegado');
}
