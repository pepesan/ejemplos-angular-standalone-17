import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';
import { Partido } from '../partidos/models/partido';

const URL_RESULTADOS = 'https://pactometro.cursosdedesarrollo.com/resultados.json';

type EstadoRecursos =
  | { status: 'loading'; items: Partido[] }
  | { status: 'success'; items: Partido[] }
  | { status: 'error'; items: Partido[]; message: string };

@Component({
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
    switchMap(() => this.http.get<Partido[]>(URL_RESULTADOS).pipe(
      map((items): EstadoRecursos => ({ status: 'success', items })),
      startWith({ status: 'loading', items: [] } as EstadoRecursos),
      catchError(() => of({ status: 'error', items: [], message: 'No se pudieron cargar los resultados.' } as EstadoRecursos)),
    )),
  );

  readonly estado = toSignal(this.respuesta, { initialValue: { status: 'loading', items: [] } as EstadoRecursos });
  readonly recursos = computed(() => this.estado().items);
  readonly cantidad = computed(() => this.recursos().length);
  readonly mensajeError = computed(() => {
    const estado = this.estado();
    return estado.status === 'error' ? estado.message : '';
  });

  reintentar(): void { this.recargar.next(); }
}
