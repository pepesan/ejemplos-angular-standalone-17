import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { crearRouter } from '../src/http/router.mjs';

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

/** Router con un manejador de errores que responde con el estado del error (como hace la aplicación real). */
const nuevoRouter = () => {
  const router = crearRouter();
  router.alFallar((ctx, error) => ctx.json(error.estado ?? 500, { message: error.message }));
  return router;
};

describe('router', () => {
  it('ejecuta los middleware globales antes que la ruta, en orden', async () => {
    const router = nuevoRouter();
    const orden = [];
    router.use(async (_c, siguiente) => { orden.push('global-1'); await siguiente(); orden.push('global-1-fin'); });
    router.use(async (_c, siguiente) => { orden.push('global-2'); await siguiente(); });
    router.get('/api/x', async () => orden.push('ruta'));
    await router.atender(ctxDe('GET', '/api/x'));
    assert.deepEqual(orden, ['global-1', 'global-2', 'ruta', 'global-1-fin']);
  });

  it('extrae parámetros y aplica la restricción de la ruta (\\d+)', async () => {
    const router = nuevoRouter();
    let recibido;
    router.get('/api/u/:id(\\d+)', async (ctx) => (recibido = ctx.params));
    await router.atender(ctxDe('GET', '/api/u/42'));
    assert.deepEqual(recibido, { id: '42' });
    const rechazada = ctxDe('GET', '/api/u/abc');
    await router.atender(rechazada);
    assert.equal(rechazada.registro.estado, 404);
  });

  it('un método no admitido devuelve 405 con Allow', async () => {
    const router = nuevoRouter();
    router.get('/api/x', async () => {});
    router.post('/api/x', async () => {});
    const ctx = ctxDe('DELETE', '/api/x');
    await router.atender(ctx);
    assert.equal(ctx.registro.estado, 405);
    assert.equal(ctx.registro.cabeceras.allow, 'GET, POST');
  });

  it('un error lanzado por un middleware llega al manejador de errores', async () => {
    const router = nuevoRouter();
    router.use(async () => { throw new Error('fallo'); });
    router.alFallar((ctx, error) => ctx.json(500, { message: error.message }));
    const ctx = ctxDe('GET', '/cualquiera');
    await router.atender(ctx);
    assert.deepEqual(ctx.registro.cuerpo, { message: 'fallo' });
  });

  it('sin manejador de errores, el error se relanza (nunca se pierde en silencio)', async () => {
    const router = crearRouter();
    router.use(async () => { throw new Error('sin manejador'); });
    await assert.rejects(router.atender(ctxDe('GET', '/x')), /sin manejador/);
  });

  it('llamar dos veces a siguiente() es un error de programación', async () => {
    const router = nuevoRouter();
    router.use(async (_c, siguiente) => { await siguiente(); await siguiente(); });
    router.get('/x', async () => {});
    const ctx = ctxDe('GET', '/x');
    await router.atender(ctx);
    assert.match(ctx.registro.cuerpo.message, /más de una vez/);
  });
});
