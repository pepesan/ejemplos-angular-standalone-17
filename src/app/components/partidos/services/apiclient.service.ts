import {Injectable} from '@angular/core';
import {Partido} from "../models/partido";
import { HttpClient } from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {

  private listado: Partido[] = [];
  // private url : string = 'https://cursosdedesarrollo.com/pactometro/resultados.json';
  private url : string = 'https://pactometro.cursosdedesarrollo.com/resultados.json';

  // El cliente HTTP se inyecta para que Angular gestione su configuración y ciclo de vida.
  constructor(private _httpClient: HttpClient) {
    console.log("cargado el cliente HTTP");
  }
  getData() {
    return this._httpClient
        // El genérico describe el cuerpo JSON; HttpClient envuelve la respuesta en Observable.
        .get<Partido[]>(this.url)
        // Ante un error, el manejador de abajo devuelve una lista vacía como fallback didáctico.
        .pipe(catchError(this.handleError('get', [])));
  }
  // Métodos de comparación heredados: convierten Observables con `toPromise()`, API obsoleta.
  // Para convertir una emisión finita en código nuevo, usa `firstValueFrom`.
  async getDataAsync(): Promise<Partido[]>
  {
    let promesa = await this._httpClient.get<Partido[]>(this.url)
        .pipe(catchError(this.handleError('get', []))).toPromise();
    return promesa;
  }

  async getProcesedDataAsync(): Promise<Partido[]>
  {
    let mipromesa = new Promise<Partido[]>(
      (resolve,reject) => {
        let promesa = this._httpClient.get<Partido[]>(this.url)
        .pipe(catchError(this.handleError('get', []))).toPromise();



        promesa.then(
          (data: Partido[]) =>
          {
            console.log(data);
            resolve(data);
          }
        );

        promesa.catch(
          (error: any) =>{
            console.log("Promise rejected with " + JSON.stringify(error));
            let listadoVacio: Partido[] = []
            reject(listadoVacio);
          }
        );

      }
    );

    return mipromesa;
  }
  async getProcesedSubscribeDataAsync(): Promise<Partido[]>
  {
    return new Promise<Partido[]>(
      resolve => {
        let observable: Observable<Partido[]> = this._httpClient.get<Partido[]>(this.url)
          .pipe(catchError(this.handleError('get', [])));
        observable.subscribe((data: Partido[]) => {
          // Aquí se puede transformar la respuesta antes de resolver la Promesa.
          resolve(data);
        });
      }
    );
  }

  private handleError (operation = 'operation', result?: any) {
    return (error: any): any[] => {
      // TODO: enviar el error a la infraestructura de registro cuando exista.
      console.error(error); // log to console instead
      // TODO: traducir el error técnico a un mensaje útil para la persona usuaria.
      console.log(`${operation} failed: ${error.message}`);
      // Este fallback evita que falle el flujo, pero puede ocultar la diferencia entre error y lista vacía.
      return result;
    };
  }
}
