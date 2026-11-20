import { ChangeDetectionStrategy, Component, Signal, WritableSignal, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap } from 'rxjs';

import {AvisoApiComponent} from "../aviso-api/aviso-api.component";
interface Curso { id: number; nombre: string; }
type EstadoBusqueda = { status: 'idle' | 'loading' | 'success' | 'error'; cursos: Curso[] };

@Component({
  imports: [AvisoApiComponent],
  selector: 'app-v2-busqueda', standalone: true,
  templateUrl: './v2-busqueda.component.html', changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2BusquedaComponent {
  private readonly http: HttpClient = inject(HttpClient);
  readonly termino: WritableSignal<string> = signal('');
  readonly estado: Signal<EstadoBusqueda> = toSignal(toObservable(this.termino).pipe(
    debounceTime(250), distinctUntilChanged(),
    switchMap((termino): Observable<EstadoBusqueda> => {
      if (!termino.trim()) return of({ status: 'idle', cursos: [] } as EstadoBusqueda);
      return this.http.get<Curso[]>('/api/cursos', { params: new HttpParams().set('q', termino) }).pipe(
        map((cursos): EstadoBusqueda => ({ status: 'success', cursos })),
        startWith({ status: 'loading', cursos: [] } as EstadoBusqueda),
        catchError(() => of({ status: 'error', cursos: [] } as EstadoBusqueda)),
      );
    }),
  ), { initialValue: { status: 'idle', cursos: [] } as EstadoBusqueda });

  actualizarTermino(event: Event): void {
    this.termino.set((event.target as HTMLInputElement).value);
  }
}
