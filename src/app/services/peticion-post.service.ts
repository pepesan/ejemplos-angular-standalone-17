import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {PostData} from "../classes/post-data";
import {PostDataResponse} from "../classes/post-data-response";
import {catchError} from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class PeticionPostService {

  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {
    console.log('PeticionPostService inicializado...');
  }
  sendPost(data: PostData): Observable<any> {
    return this.http.post(this.apiUrl, data).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en el servicio:', error);
    return throwError(() => new Error(
      error.error?.message || 'Ocurrió un error en la petición POST'
    ));
  }
}
