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

  // inyección de dependencias del cliente HTTP
  constructor(private _httpClient: HttpClient) {
    console.log("cargado el cliente HTTP");
  }
  getData() {
    return this._httpClient
        // realiza una petición get a la url y devuelve un Observable<Dato>
        .get<Observable<Partido[]>>(this.url)
        // Si algo ha salido mal llama a la función handlerError
        .pipe(catchError(this.handleError('get', [])));
  }
  async getDataAsync(): Promise<Partido[]>
  {
    let promesa = await this._httpClient.get<Observable<Partido[]>>(this.url)
        .pipe(catchError(this.handleError('get', []))).toPromise();
    return promesa;
  }

  async getProcesedDataAsync(): Promise<Partido[]>
  {
    let mipromesa = new Promise<Partido[]>(
      (resolve,reject) => {
        let promesa = this._httpClient.get<Observable<Partido[]>>(this.url)
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
        let observable: Observable<Partido[]> = this._httpClient.get<Observable<Partido[]>>(this.url)
          .pipe(catchError(this.handleError('get', [])));
        observable.subscribe((data: Partido[]) => {
          // realizar cualquier tipo de procesado de datos necesario
          resolve(data);
        });
      }
    );
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
