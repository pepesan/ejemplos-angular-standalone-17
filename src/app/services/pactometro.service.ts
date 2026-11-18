import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, TimeoutError, of, timer } from 'rxjs';
import { catchError, map, retry, timeout } from 'rxjs/operators';
import {Partido} from "../components/partidos/models/partido";

/** Resultado de la consulta: los partidos y de dónde han salido. */
export interface ResultadosPactometro {
  partidos: Partido[];
  /** 'remoto' si vienen del servidor; 'respaldo' si la petición falló y se usan datos locales. */
  origen: 'remoto' | 'respaldo';
}

/** Partido ya procesado por el servicio: añade el porcentaje de escaños sobre el total. */
export interface PartidoProcesado extends Partido {
  porcentaje: number;
}

/** Opciones de `getResultadosConReintentos()`. */
export interface OpcionesReintento {
  /** Reintentos tras el primer fallo (por defecto 2: hasta 3 peticiones en total). */
  reintentos?: number;
  /** Tiempo máximo de espera de CADA petición, en ms (por defecto 3000). */
  timeoutMs?: number;
  /** Pausa entre un fallo y el siguiente intento, en ms (por defecto 500). */
  esperaMs?: number;
}

/** Sucesos que emite `getResultadosConReintentos()` para que el componente pueda avisar al usuario. */
export type EventoPeticion =
  | { tipo: 'reintento'; intento: number; maximo: number; motivo: string }
  | { tipo: 'exito'; partidos: Partido[] }
  | { tipo: 'fallo'; motivo: string; partidos: Partido[] };

/** Traduce el error técnico a un texto comprensible. */
function describirError(error: unknown, timeoutMs: number): string {
  if (error instanceof TimeoutError) return `se agotó el tiempo de espera (${timeoutMs} ms)`;
  if (error instanceof HttpErrorResponse) {
    return error.status === 0 ? 'no hay conexión con el servidor' : `el servidor respondió con el error ${error.status}`;
  }
  return 'error desconocido';
}

/**
 * Datos locales que el servicio devuelve cuando la petición falla, para que el componente
 * siempre tenga algo que mostrar. Son una muestra, no los resultados reales.
 */
export const PARTIDOS_RESPALDO: Partido[] = [
  { nombre: 'PP', dipu: 137, imagen: '' },
  { nombre: 'PSOE', dipu: 121, imagen: '' },
  { nombre: 'Vox', dipu: 33, imagen: '' },
];

@Injectable({
  providedIn: 'root'
})
export class PactometroService {
  private readonly url = 'https://pactometro.cursosdedesarrollo.com/resultados.json';

  constructor(private http: HttpClient) {}

  /**
   * La lógica de qué hacer ante un fallo vive AQUÍ, no en el componente: `catchError` captura el
   * error de la petición, lo registra y devuelve datos de respaldo en vez de propagar el error.
   * El observable por tanto nunca falla y el componente solo tiene que pintar lo que reciba.
   */
  getResultados(): Observable<ResultadosPactometro> {
    return this.http.get<Partido[]>(this.url).pipe(
      map((partidos): ResultadosPactometro => ({ partidos, origen: 'remoto' })),
      catchError(error => {
        console.error('Error fetching resultados', error);
        return of<ResultadosPactometro>({ partidos: PARTIDOS_RESPALDO, origen: 'respaldo' });
      })
    );
  }

  /**
   * Carga los datos con la misma petición (y el mismo respaldo ante fallos) y los MODIFICA antes de
   * entregarlos al componente: descarta partidos sin escaños, los ordena de mayor a menor y calcula
   * `porcentaje` sobre el total de escaños. El componente recibe los datos ya listos para pintar.
   */
  getResultadosProcesados(): Observable<{ partidos: PartidoProcesado[]; origen: ResultadosPactometro['origen'] }> {
    return this.getResultados().pipe(
      map(({ partidos, origen }) => {
        const validos = partidos.filter((p) => p.dipu > 0);
        const total = validos.reduce((suma, p) => suma + p.dipu, 0);
        const procesados = validos
          .map((p) => ({ ...p, porcentaje: total ? Math.round((p.dipu / total) * 1000) / 10 : 0 }))
          .sort((a, b) => b.dipu - a.dipu);
        return { partidos: procesados, origen };
      })
    );
  }

  /**
   * Petición con TIMEOUT y REINTENTOS. Emite eventos en lugar de solo datos:
   *  - `timeout(timeoutMs)` falla con `TimeoutError` si una petición tarda demasiado.
   *  - `retry({ count, delay })` vuelve a lanzar la petición (hasta `reintentos` veces) y, en `delay`,
   *    avisa de cada reintento antes de esperar `esperaMs`. El `timeout` va ANTES de `retry` para que
   *    cada intento tenga su propio límite de tiempo.
   *  - Si se agotan los reintentos, emite `fallo` con los datos de respaldo, así que nunca da error.
   */
  getResultadosConReintentos(opciones: OpcionesReintento = {}): Observable<EventoPeticion> {
    const { reintentos = 2, timeoutMs = 3000, esperaMs = 500 } = opciones;
    return new Observable<EventoPeticion>((subscriber) => {
      return this.http.get<Partido[]>(this.url).pipe(
        timeout(timeoutMs),
        retry({
          count: reintentos,
          delay: (error, intento) => {
            subscriber.next({ tipo: 'reintento', intento, maximo: reintentos, motivo: describirError(error, timeoutMs) });
            return timer(esperaMs);
          },
        }),
      ).subscribe({
        next: (partidos) => {
          subscriber.next({ tipo: 'exito', partidos });
          subscriber.complete();
        },
        error: (error) => {
          subscriber.next({ tipo: 'fallo', motivo: describirError(error, timeoutMs), partidos: PARTIDOS_RESPALDO });
          subscriber.complete();
        },
      });
    });
  }
}
