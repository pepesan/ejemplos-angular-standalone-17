import { InjectionToken, Service, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

/**
 * MEJORES PRÁCTICAS DE ACCESO A UNA API (resumen; se aplican en este fichero):
 *
 *  1. UN SOLO PUNTO DE ACCESO. Solo este servicio conoce las URLs y usa `HttpClient`. Los componentes
 *     llaman a métodos con nombre de negocio (`listar`, `crear`…) y no saben nada de HTTP.
 *  2. URL BASE CONFIGURABLE. Se inyecta con un `InjectionToken` (por defecto `/api`, relativa para que
 *     pase por el proxy de `ng serve` y no haya CORS) en vez de repetir la URL en cada llamada.
 *  3. TIPOS EXPLÍCITOS. `http.get<Usuario[]>()` y los tipos `Usuario` / `UsuarioNuevo` evitan `any`.
 *  4. PARÁMETROS CON `params`, no concatenados a mano en la URL (Angular codifica los valores).
 *  5. OBSERVABLES FRÍOS. El servicio devuelve el Observable y NO se suscribe: decide el componente
 *     (con `subscribe`, `takeUntilDestroyed`, `toSignal`…). Una petición HTTP se completa sola.
 *  6. ERRORES PROPIOS. `catchError` convierte `HttpErrorResponse` en `ErrorApi` (mensaje en español,
 *     estado y errores por campo). La interfaz no depende de la forma del error HTTP.
 *  7. LO TRANSVERSAL VA EN INTERCEPTORES: el interceptor `jwtAuthInterceptor` añade `Authorization: Bearer`
 *     a las peticiones a `/api/`; ningún método de este servicio toca el token.
 *  8. SIN ESTADO DUPLICADO. El servicio no guarda los datos; el estado vive en el componente (signals).
 *  9. LISTAS GRANDES: paginar, filtrar y ordenar en el servidor y enviarlo como parámetros de consulta.
 *
 * `@Service()` es la forma de Angular 22: singleton en el inyector raíz y solo admite `inject()`.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api',
});

export type Rol = 'alumno' | 'profesor' | 'admin';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
}

/** Lo que se envía al crear o editar: el `id` lo asigna el servidor. */
export type UsuarioNuevo = Omit<Usuario, 'id'>;

export type ColumnaOrden = 'id' | 'nombre' | 'email' | 'rol';

/** Filtro, orden y paginación: se envían al servidor, que es quien filtra, ordena y corta la lista. */
export interface ConsultaUsuarios {
  q: string;
  /** Página, empezando en 1. */
  page: number;
  size: number;
  sort: ColumnaOrden;
  dir: 'asc' | 'desc';
}

/** Una página de resultados más el total, para poder pintar el paginador. */
export interface PaginaUsuarios {
  items: Usuario[];
  total: number;
  page: number;
  size: number;
}

/** Error de la API ya traducido: mensaje legible, código HTTP y mensajes por campo (400/409). */
export class ErrorApi extends Error {
  constructor(
    mensaje: string,
    readonly estado: number,
    readonly errores: Partial<Record<keyof UsuarioNuevo, string>> = {},
  ) {
    super(mensaje);
    this.name = 'ErrorApi';
  }
}

function traducirError(error: HttpErrorResponse): Observable<never> {
  const cuerpo = error.error as { message?: string; errores?: ErrorApi['errores'] } | null;
  let mensaje: string;
  if (error.status === 0) mensaje = 'No hay conexión con el servidor. ¿Está arrancado el backend (npm run backend)?';
  else if (error.status >= 500) mensaje = 'El servidor ha fallado. Inténtalo de nuevo más tarde.';
  else mensaje = cuerpo?.message ?? `La petición ha fallado (HTTP ${error.status}).`;
  return throwError(() => new ErrorApi(mensaje, error.status, cuerpo?.errores ?? {}));
}

@Service()
export class UsuariosApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/usuarios`;

  /** Paginación, filtro y orden en el SERVIDOR: la lista puede ser enorme y no se descarga entera. */
  listar(consulta: ConsultaUsuarios): Observable<PaginaUsuarios> {
    const { q, page, size, sort, dir } = consulta;
    return this.http
      .get<PaginaUsuarios>(this.url, { params: { ...(q ? { q } : {}), page, size, sort, dir } })
      .pipe(catchError(traducirError));
  }

  obtener(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`).pipe(catchError(traducirError));
  }

  crear(usuario: UsuarioNuevo): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, usuario).pipe(catchError(traducirError));
  }

  /** PUT reemplaza el recurso completo; para cambios parciales se usaría PATCH. */
  actualizar(id: number, usuario: UsuarioNuevo): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}/${id}`, usuario).pipe(catchError(traducirError));
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(catchError(traducirError));
  }
}
