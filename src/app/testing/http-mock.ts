import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

/** Una respuesta simulada para las peticiones que coincidan con `metodo` y `url`. */
export interface RutaMock {
  /** Método HTTP (por defecto GET). */
  metodo?: string;
  /** Texto o expresión que debe aparecer en la URL de la petición. */
  url: string | RegExp;
  /** Código de estado (por defecto 200). Un valor >= 400 o 0 produce un error HTTP. */
  status?: number;
  cuerpo?: unknown;
}

/**
 * Interceptor para Storybook y pruebas: responde con datos fijos y NO sale a la red, así las stories
 * son deterministas y pueden mostrar también los estados de error. Las peticiones sin ruta simulada
 * devuelven un 404 explícito para detectar llamadas inesperadas.
 */
export function interceptorMock(rutas: RutaMock[]): HttpInterceptorFn {
  return (peticion) => {
    const ruta = rutas.find(
      (r) =>
        (r.metodo ?? 'GET') === peticion.method &&
        (typeof r.url === 'string' ? peticion.url.includes(r.url) : r.url.test(peticion.url)),
    );
    const status = ruta?.status ?? (ruta ? 200 : 404);
    if (status === 0 || status >= 400) {
      return throwError(() => new HttpErrorResponse({ url: peticion.url, status, statusText: 'Mock', error: ruta?.cuerpo ?? null }));
    }
    return of(new HttpResponse({ url: peticion.url, status, body: ruta?.cuerpo ?? null }));
  };
}
