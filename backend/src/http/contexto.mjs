/**
 * Contexto de una petición: lo que comparten todos los middleware y controladores. Así ninguno toca `request` o
 * `response` directamente, salvo lo imprescindible.
 */
export function crearContexto(solicitud, respuesta) {
  const url = new URL(solicitud.url ?? '/', `http://${solicitud.headers.host ?? 'localhost'}`);
  return {
    solicitud,
    respuesta,
    url,
    /** Parámetros de la URL (`?q=ana&page=2` → `{ q: 'ana', page: '2' }`). */
    query: Object.fromEntries(url.searchParams),
    /** Parámetros de la ruta (`/api/usuarios/:id`), rellenados por el router. */
    params: {},
    /** Payload del JWT ya verificado, rellenado por `requerirSesion`. */
    claims: null,
    /** Lee el cuerpo JSON (lo prepara el middleware `cuerpoJson`). */
    leerJson: async () => {
      throw new Error('cuerpoJson no está registrado');
    },
    json(estado, cuerpo) {
      respuesta.writeHead(estado, {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
      });
      respuesta.end(JSON.stringify(cuerpo));
    },
    sinContenido(cabeceras = {}) {
      respuesta.writeHead(204, cabeceras);
      respuesta.end();
    },
  };
}
