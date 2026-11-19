import { HttpErrorResponse } from '@angular/common/http';
import { ErrorApi } from '../../services/usuarios-api.service';

/**
 * Con `ng serve` + proxy, si el backend no está arrancado el proxy responde 502/503/504 (o 0 si no hay conexión):
 * es un fallo de entorno, no de la API, y conviene decirle al alumno cómo resolverlo.
 */
export const ESTADOS_SIN_BACKEND = [0, 502, 503, 504];

export function esSinBackend(error: unknown): boolean {
  const estado = error instanceof HttpErrorResponse ? error.status : error instanceof ErrorApi ? error.estado : null;
  return estado !== null && ESTADOS_SIN_BACKEND.includes(estado);
}
