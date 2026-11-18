import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContadorPlanoService } from '../../services/contador-plano.service';

import {AvisoApiComponent} from "../aviso-api/aviso-api.component";
@Component({
  imports: [AvisoApiComponent],
  selector: 'app-v2-servicio-sin-injectable',
  templateUrl: './v2-servicio-sin-injectable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // REGISTRO DEL SERVICIO. Como la clase no lleva decorador, se registra aquí.
  // NO es singleton: Angular crea una instancia nueva por cada instancia de este componente
  // (y la comparten sus hijos de plantilla); se destruye con el componente.
  // Compáralo con `@Service()` (o `@Injectable({ providedIn: 'root' })`), que sí es singleton de toda la app.
  providers: [ContadorPlanoService],
})
export class V2ServicioSinInjectableComponent {
  // `inject()` pide al inyector la instancia registrada arriba (la del componente, no una global).
  readonly contador = inject(ContadorPlanoService);
}
