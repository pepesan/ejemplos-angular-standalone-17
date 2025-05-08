import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Partido} from "../components/partidos/models/partido";

@Injectable({
  providedIn: 'root'
})
export class PactometroService {
  private readonly url = 'https://pactometro.cursosdedesarrollo.com/resultados.json';

  constructor(private http: HttpClient) {}

  getResultados(): Observable<Partido[]> {
    return this.http.get<Partido[]>(this.url).pipe(
      catchError(error => {
        console.error('Error fetching resultados', error);
        return throwError(() => new Error('Error al cargar resultados'));
      })
    );
  }
}
