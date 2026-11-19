/** Ruta en la que se carga esta feature (ver `app.routes.ts`). Las pantallas enlazan a ella y a sus hijas. */
export const RUTA_BASE = '/v2/usuarios-navegacion';

/**
 * Solo se vuelve a URLs de esta feature después del login: aceptar cualquier `returnUrl` permitiría redirigir
 * al usuario a otra web (open redirect) desde un enlace manipulado.
 */
export function esUrlInterna(url: string | null | undefined): url is string {
  return typeof url === 'string' && (url === RUTA_BASE || url.startsWith(`${RUTA_BASE}/`) || url.startsWith(`${RUTA_BASE}?`));
}
