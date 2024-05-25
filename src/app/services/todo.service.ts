import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
import {Partido} from "../components/uso-service/partido";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  url = 'https://pactometro.cursosdedesarrollo.com/resultados.json';
  constructor(private _httpClient: HttpClient) {console.log('TodoService inicializado...');}
  getData() {
    return this._httpClient.get<Observable<Partido[]>>(this.url)
      .pipe(catchError(this.handleError('get', [])));
  }
  private handleError (operation = 'operation', result?: any) {
    return (error: any): any[] => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return [];
    };
  }
}
