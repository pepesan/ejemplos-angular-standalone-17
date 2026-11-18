import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostData } from '../classes/post-data';
import { PostDataResponse } from '../classes/post-data-response';

/**
 * Ejemplo mínimo de petición POST: envía un objeto a una API pública y devuelve su respuesta.
 *
 * JSONPlaceholder es una API de pruebas que acepta cualquier POST y responde 201 con el objeto
 * recibido más un `id`. No guarda nada de verdad, así que siempre funciona.
 */
@Injectable({ providedIn: 'root' })
export class EnvioPostService {
  private readonly http = inject(HttpClient);
  private readonly url = 'https://jsonplaceholder.typicode.com/posts';

  // `http.post(url, cuerpo)` serializa el cuerpo a JSON y añade `Content-Type: application/json`.
  // Es un observable "frío": la petición no sale hasta que alguien se suscribe.
  enviar(post: PostData): Observable<PostDataResponse> {
    return this.http.post<PostDataResponse>(this.url, post);
  }
}
