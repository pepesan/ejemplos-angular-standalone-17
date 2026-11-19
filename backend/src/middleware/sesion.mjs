import { noAutenticado, prohibido } from '../errores.mjs';

/**
 * Autenticación (¿quién eres?): exige un `Authorization: Bearer <jwt>` válido y deja el payload en `ctx.claims`.
 * Sin token válido o caducado, 401.
 */
export function requerirSesion(jwt) {
  return async (ctx, siguiente) => {
    const coincidencia = /^Bearer\s+(.+)$/i.exec(ctx.solicitud.headers.authorization ?? '');
    const claims = coincidencia ? jwt.verificar(coincidencia[1]) : null;
    if (!claims) throw noAutenticado();
    ctx.claims = claims;
    await siguiente();
  };
}

/**
 * Autorización (¿qué puedes hacer?): solo el rol `admin`. Va DESPUÉS de `requerirSesion`. Ocultar botones en la
 * interfaz no basta: el servidor también debe rechazar la escritura (403).
 */
export function requerirAdmin(mensaje) {
  return async (ctx, siguiente) => {
    if (ctx.claims?.role !== 'admin') throw prohibido(mensaje);
    await siguiente();
  };
}
