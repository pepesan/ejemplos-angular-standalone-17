import { ErrorHttp } from '../errores.mjs';

/**
 * Manejador de errores: un `ErrorHttp` se envía tal cual; cualquier otra excepción es un 500 genérico (el detalle
 * se registra en consola, no se devuelve al cliente).
 */
export function manejarErrores(ctx, error) {
  if (error instanceof ErrorHttp) {
    return ctx.json(error.estado, { error: error.codigo, message: error.message, ...error.extra });
  }
  console.error(error);
  return ctx.json(500, { error: 'internal_error', message: 'Error interno del servidor de demostración.' });
}
