/**
 * CORS: solo los orígenes indicados reciben cabeceras. Las peticiones OPTIONS (preflight) se contestan aquí mismo
 * con 204 y no llegan a los controladores.
 */
export function cors(origenesPermitidos) {
  return async (ctx, siguiente) => {
    const origen = ctx.solicitud.headers.origin;
    if (origen && origenesPermitidos.includes(origen)) {
      ctx.respuesta.setHeader('access-control-allow-origin', origen);
      ctx.respuesta.setHeader('access-control-allow-headers', 'content-type, authorization');
      ctx.respuesta.setHeader('access-control-allow-methods', 'GET, POST, PUT, DELETE, OPTIONS');
      ctx.respuesta.setHeader('vary', 'origin');
    }
    if (ctx.solicitud.method === 'OPTIONS') return ctx.sinContenido();
    await siguiente();
  };
}
