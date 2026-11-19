/** Registra en consola cada petición (método, ruta, estado y tiempo). Se activa con `LOG_REQUESTS=true`. */
export async function registrarPeticion(ctx, siguiente) {
  const inicio = performance.now();
  ctx.respuesta.on('finish', () => {
    const ms = (performance.now() - inicio).toFixed(1);
    console.log(`${ctx.solicitud.method} ${ctx.url.pathname} → ${ctx.respuesta.statusCode} (${ms} ms)`);
  });
  await siguiente();
}
