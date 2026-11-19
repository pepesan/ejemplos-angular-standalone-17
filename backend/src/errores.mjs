/**
 * Errores de la API. Servicios y middleware LANZAN estos errores; el manejador de errores los convierte en la
 * respuesta JSON `{ error, message, ...extra }`. Así ningún controlador arma respuestas de error a mano.
 */
export class ErrorHttp extends Error {
  /**
   * @param {number} estado Código HTTP.
   * @param {string} codigo Identificador estable (`not_found`, `validation`...).
   * @param {string} mensaje Texto legible.
   * @param {Record<string, unknown>} [extra] Campos extra de la respuesta (p. ej. `errores` por campo).
   */
  constructor(estado, codigo, mensaje, extra = {}) {
    super(mensaje);
    this.name = 'ErrorHttp';
    this.estado = estado;
    this.codigo = codigo;
    this.extra = extra;
  }
}

export const noAutenticado = () => new ErrorHttp(401, 'unauthorized', 'Falta un JWT válido o ha caducado.');
export const credencialesInvalidas = () => new ErrorHttp(401, 'invalid_credentials', 'Usuario o contraseña incorrectos.');
export const prohibido = (mensaje) => new ErrorHttp(403, 'forbidden', mensaje);
export const noEncontrado = (mensaje) => new ErrorHttp(404, 'not_found', mensaje);
export const metodoNoPermitido = () => new ErrorHttp(405, 'method_not_allowed', 'Método no permitido en este recurso.');
export const conflicto = (mensaje, errores) => new ErrorHttp(409, 'conflict', mensaje, { errores });
export const validacion = (errores) => new ErrorHttp(400, 'validation', 'Datos no válidos.', { errores });
export const peticionInvalida = (estado, mensaje) => new ErrorHttp(estado, 'bad_request', mensaje);
export const noDisponible = (mensaje) => new ErrorHttp(503, 'demo_unavailable', mensaje);
