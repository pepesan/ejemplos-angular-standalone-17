import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Partido } from '../partidos/models/partido';

/**
 * SERVICIO de acceso a la API de resultados (`@Service()`, Angular 22.0 o posterior; en versiones anteriores,
 * `@Injectable({ providedIn: 'root' })`, equivalente).
 *
 * Por qué un servicio: el componente deja de conocer la URL y el `HttpClient`; solo pide «los resultados».
 * Si la URL cambia, o se quiere cachear o transformar la respuesta, se toca aquí y no en cada componente.
 * Es singleton: una única instancia en toda la aplicación.
 *
 * Devuelve el `Observable` tal cual (frío): cada suscripción lanza una petición. El estado de carga/error
 * lo gestiona quien lo consume, porque depende de la pantalla (no del acceso a datos).
 */
@Service()
export class ResultadosApiService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/resultados';

  obtener(): Observable<Partido[]> {
    return this.http.get<Partido[]>(this.url);
  }
}
