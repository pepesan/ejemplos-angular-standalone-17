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
}
