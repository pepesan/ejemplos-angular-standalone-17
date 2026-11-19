import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { EstadoResultados, Resultado } from './resultado';

/**
 * Acceso a `resultados.json` con el error ya gestionado: el componente no necesita `catchError`.
 * `estado()` emite primero `loading` y después `success` o `error`; así el componente solo convierte el flujo
 * en una signal con `toSignal` y la plantilla decide qué pintar.
 */
@Injectable({ providedIn: 'root' })
export class ResultadoService {
  private readonly http = inject(HttpClient);
  private readonly url = 'https://pactometro.cursosdedesarrollo.com/resultados.json';

  estado(): Observable<EstadoResultados> {
    return this.http.get<Resultado[]>(this.url).pipe(
      map((items): EstadoResultados => ({ status: 'success', items })),
      startWith<EstadoResultados>({ status: 'loading' }),
      // El error se registra en consola y se convierte en un estado, no en una excepción que rompa el flujo.
      catchError((error: unknown) => {
        console.error('No se pudo cargar resultados.json', error);
        return of<EstadoResultados>({ status: 'error', mensaje: 'No se pudieron cargar los resultados. Inténtalo de nuevo más tarde.' });
      }),
    );
  }
}
