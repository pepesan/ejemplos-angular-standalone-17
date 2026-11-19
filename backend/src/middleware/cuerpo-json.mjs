import { peticionInvalida } from '../errores.mjs';

/**
 * Prepara `ctx.leerJson()`: el cuerpo se lee solo cuando un controlador lo pide, con un límite de tamaño.
 * Sin cuerpo devuelve `{}`; con JSON inválido o demasiado grande lanza un error 400/413.
 */
export function cuerpoJson(limiteBytes) {
  return async (ctx, siguiente) => {
    ctx.leerJson = () => leer(ctx.solicitud, limiteBytes);
    await siguiente();
  };
}

async function leer(solicitud, limiteBytes) {
  const trozos = [];
  let tamano = 0;
  for await (const trozo of solicitud) {
    tamano += trozo.length;
    if (tamano > limiteBytes) throw peticionInvalida(413, 'El cuerpo supera el límite permitido.');
    trozos.push(trozo);
  }
  if (tamano === 0) return {};
  try {
    return JSON.parse(Buffer.concat(trozos).toString('utf8'));
  } catch {
    throw peticionInvalida(400, 'El cuerpo debe contener JSON válido.');
  }
}
