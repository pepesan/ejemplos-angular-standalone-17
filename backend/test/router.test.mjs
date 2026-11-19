import { describe, expect, it } from 'vitest';
import { crearRouter } from '../src/http/router.mjs';

/** Router con un manejador de errores que responde con el estado del error (como la aplicación real). */
const nuevoRouter = () => {
  const router = crearRouter();
  router.alFallar((ctx, error) => ctx.json(error.estado ?? 500, { message: error.message }));
  return router;
};

/** Contexto mínimo para probar el router sin HTTP real. */
const ctxDe = (method, pathname) => {
  const registro = { cabeceras: {}, estado: null, cuerpo: null };
  return {
    solicitud: { method, headers: {} },
    respuesta: { setHeader: (k, v) => (registro.cabeceras[k] = v) },
    url: new URL(`http://x${pathname}`),
    json: (estado, cuerpo) => Object.assign(registro, { estado, cuerpo }),
    registro,
  };
};

describe('router', () => {
  it('ejecuta los middleware globales antes que la ruta, en orden', async () => {
    const router = nuevoRouter();
    const orden = [];
    router.use(async (_c, siguiente) => { orden.push('global-1'); await siguiente(); orden.push('global-1-fin'); });
    router.use(async (_c, siguiente) => { orden.push('global-2'); await siguiente(); });
    router.get('/api/x', async () => orden.push('ruta'));
    await router.atender(ctxDe('GET', '/api/x'));
    expect(orden).toEqual(['global-1', 'global-2', 'ruta', 'global-1-fin']);
  });

  it('un middleware de ruta que llama a siguiente() termina la cadena sin error', async () => {
    const router = nuevoRouter();
    const orden = [];
    router.get('/api/y', async (_c, siguiente) => { orden.push('mw'); await siguiente(); }, async () => orden.push('handler'));
    const ctx = ctxDe('GET', '/api/y');
    await router.atender(ctx);
    expect(orden).toEqual(['mw', 'handler']);
  });

  it('extrae parámetros y aplica la restricción (\\d+)', async () => {
    const router = nuevoRouter();
    let recibido;
    router.get('/api/u/:id(\\d+)', async (ctx) => (recibido = ctx.params));
    await router.atender(ctxDe('GET', '/api/u/42'));
    expect(recibido).toEqual({ id: '42' });
    const rechazada = ctxDe('GET', '/api/u/abc');
    await router.atender(rechazada);
    expect(rechazada.registro.estado).toBe(404);
  });

  it('decodifica los parámetros con caracteres codificados', async () => {
    const router = nuevoRouter();
    let recibido;
    router.get('/api/r/:nombre', async (ctx) => (recibido = ctx.params));
    await router.atender(ctxDe('GET', '/api/r/a%20b'));
    expect(recibido).toEqual({ nombre: 'a b' });
  });

  it('un método no admitido devuelve 405 con Allow', async () => {
    const router = nuevoRouter();
    router.get('/api/x', async () => {});
    router.post('/api/x', async () => {});
    const ctx = ctxDe('DELETE', '/api/x');
    await router.atender(ctx);
    expect(ctx.registro.estado).toBe(405);
    expect(ctx.registro.cabeceras.allow).toBe('GET, POST');
  });

  it('un error lanzado por un middleware llega al manejador de errores', async () => {
    const router = crearRouter();
    router.use(async () => { throw new Error('fallo'); });
    router.alFallar((ctx, error) => ctx.json(500, { message: error.message }));
    const ctx = ctxDe('GET', '/cualquiera');
    await router.atender(ctx);
    expect(ctx.registro.cuerpo).toEqual({ message: 'fallo' });
  });

  it('sin manejador de errores, el error se relanza (nunca se pierde en silencio)', async () => {
    const router = crearRouter();
    router.use(async () => { throw new Error('sin manejador'); });
    await expect(router.atender(ctxDe('GET', '/x'))).rejects.toThrow('sin manejador');
  });

  it('llamar dos veces a siguiente() es un error de programación', async () => {
    const router = nuevoRouter();
    router.use(async (_c, siguiente) => { await siguiente(); await siguiente(); });
    router.get('/x', async () => {});
    const ctx = ctxDe('GET', '/x');
    await router.atender(ctx);
    expect(ctx.registro.cuerpo.message).toMatch(/más de una vez/);
  });
});
