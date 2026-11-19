import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith } from 'rxjs';
import { AvisoApiComponent } from '../aviso-api/aviso-api.component';
import { Partido } from '../partidos/models/partido';
import { ResultadosApiService } from './resultados-api.service';

type Estado =
  | { status: 'loading' }
  | { status: 'success'; items: Partido[] }
  | { status: 'error'; backendCaido: boolean };

/**
 * Un solo componente y un servicio. El componente no conoce `HttpClient` ni la URL: pide los resultados al
 * servicio y convierte el flujo en un estado (cargando, éxito o error) que la plantilla pinta.
 */
@Component({
  imports: [AvisoApiComponent],
  selector: 'app-v2-consumo-api-servicio',
  templateUrl: './v2-consumo-api-servicio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2ConsumoApiServicioComponent {
  private readonly resultados = inject(ResultadosApiService);

  readonly estado = toSignal(
    this.resultados.obtener().pipe(
      map((items): Estado => ({ status: 'success', items })),
      startWith<Estado>({ status: 'loading' }),
      // Con `ng serve` + proxy, si el backend no está arrancado el proxy responde 0/502/503/504.
      catchError((error: unknown) => of<Estado>({
        status: 'error',
        backendCaido: error instanceof HttpErrorResponse && [0, 502, 503, 504].includes(error.status),
      })),
    ),
    { initialValue: { status: 'loading' } as Estado },
  );
}
