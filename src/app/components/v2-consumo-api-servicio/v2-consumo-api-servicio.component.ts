import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';
import { AvisoApiComponent } from '../aviso-api/aviso-api.component';
import { Partido } from '../partidos/models/partido';
import { esBackendCaido } from '../v2-consumo-api/v2-consumo-api.component';
import { ResultadosApiService } from './resultados-api.service';

type EstadoRecursos =
  | { status: 'loading'; items: Partido[] }
  | { status: 'success'; items: Partido[] }
  | { status: 'error'; items: Partido[]; message: string; backendCaido: boolean };

/**
 * Mismo ejemplo que `V2ConsumoApiComponent`, pero el acceso a la API vive en `ResultadosApiService`.
 * Compáralos: aquí el componente no inyecta `HttpClient` ni conoce la URL; solo orquesta estados de pantalla.
 */
@Component({
  imports: [AvisoApiComponent],
  selector: 'app-v2-consumo-api-servicio',
  templateUrl: './v2-consumo-api-servicio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2ConsumoApiServicioComponent {
  private readonly resultados = inject(ResultadosApiService);
  private readonly recargar = new Subject<void>();
  private readonly respuesta = this.recargar.pipe(
    startWith(undefined),
    // Cada reintento crea una petición nueva y cancela la anterior si aún sigue activa.
    switchMap(() => this.resultados.obtener().pipe(
      map((items): EstadoRecursos => ({ status: 'success', items })),
      startWith({ status: 'loading', items: [] } as EstadoRecursos),
      catchError((error: unknown) => of({
        status: 'error', items: [], message: 'No se pudieron cargar los resultados.', backendCaido: esBackendCaido(error),
      } as EstadoRecursos)),
    )),
  );

  readonly estado = toSignal(this.respuesta, { initialValue: { status: 'loading', items: [] } as EstadoRecursos });
  readonly recursos = computed(() => this.estado().items);
  readonly cantidad = computed(() => this.recursos().length);
  readonly backendCaido = computed(() => {
    const estado = this.estado();
    return estado.status === 'error' && estado.backendCaido;
  });
  readonly mensajeError = computed(() => {
    const estado = this.estado();
    return estado.status === 'error' ? estado.message : '';
  });

  reintentar(): void { this.recargar.next(); }
}
