import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
}
