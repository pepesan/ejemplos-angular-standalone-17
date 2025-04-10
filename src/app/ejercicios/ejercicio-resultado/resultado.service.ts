import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs'
import {Resultado} from "./resultado";

@Injectable({
  providedIn: 'root'
})
export class ResultadoService {

  private url : string = 'https://pactometro.cursosdedesarrollo.com/resultados.json';

  constructor(private _httpClient: HttpClient) {
    console.log("cargado el cliente HTTP");
  }
  getData() {
    return this._httpClient
      // realiza una petición get a la url y devuelve un Observable<Dato>
      .get<Observable<Resultado[]>>(this.url)
      // Si algo ha salido mal llama a la función handlerError
      .pipe(catchError(this.handleError('get', [])));
  }

  private handleError (operation = 'operation', result?: any) {
    return (error: any): any[] => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return result;
    };
  }
}
