import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';
import { Partido } from '../partidos/models/partido';

import {AvisoApiComponent} from "../aviso-api/aviso-api.component";
const URL_RESULTADOS = '/api/resultados';

/**
 * Con `ng serve` + proxy, si el backend no está arrancado el proxy responde 502/503/504 (o 0 si no hay red):
 * es un fallo de entorno, no un fallo de la API, y conviene decirle al alumno cómo resolverlo.
 */
export function esBackendCaido(error: unknown): boolean {
  return error instanceof HttpErrorResponse && [0, 502, 503, 504].includes(error.status);
}

type EstadoRecursos =
  | { status: 'loading'; items: Partido[] }
  | { status: 'success'; items: Partido[] }
  | { status: 'error'; items: Partido[]; message: string; backendCaido: boolean };

@Component({
  imports: [AvisoApiComponent],
  selector: 'app-v2-consumo-api',
  standalone: true,
  templateUrl: './v2-consumo-api.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2ConsumoApiComponent {
  private readonly http = inject(HttpClient);
  private readonly recargar = new Subject<void>();
  private readonly respuesta = this.recargar.pipe(
    startWith(undefined),
    // Cada reintento crea una petición nueva y cancela la anterior si aún sigue activa.
    switchMap(() => this.http.get<Partido[]>(URL_RESULTADOS).pipe(
      map((items): EstadoRecursos => ({ status: 'success', items })),
      startWith({ status: 'loading', items: [] } as EstadoRecursos),
      // El error se convierte en estado dentro del flujo de cada petición; así se puede volver a intentar.
      catchError((error: unknown) => of({ status: 'error', items: [], message: 'No se pudieron cargar los resultados.', backendCaido: esBackendCaido(error) } as EstadoRecursos)),
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
