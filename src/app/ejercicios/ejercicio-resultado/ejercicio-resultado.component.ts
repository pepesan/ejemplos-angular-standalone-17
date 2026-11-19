import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EnunciadoComponent } from '../enunciado/enunciado.component';
import { EstadoResultados } from './resultado';
import { ResultadoService } from './resultado.service';

@Component({
  selector: 'app-ejercicio-resultado',
  imports: [EnunciadoComponent],
  templateUrl: './ejercicio-resultado.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './ejercicio-resultado.component.css',
})
export class EjercicioResultadoComponent {
  // `toSignal` se suscribe al Observable del servicio y se da de baja solo al destruir el componente:
  // no hace falta `ngOnDestroy` ni el pipe `async`.
  readonly estado = toSignal(inject(ResultadoService).estado(), { initialValue: { status: 'loading' } as EstadoResultados });
}
