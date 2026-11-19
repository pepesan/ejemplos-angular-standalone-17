import { EventEmitter } from 'node:events';
import { describe, expect, it, vi } from 'vitest';
import { crearContexto } from '../src/http/contexto.mjs';
import { ErrorHttp, conflicto } from '../src/errores.mjs';
import { manejarErrores } from '../src/middleware/errores.mjs';

/** Respuesta falsa que guarda lo escrito, para probar el contexto sin HTTP. */
function respuestaFalsa() {
  const r = Object.assign(new EventEmitter(), { cabeceras: null, estado: null, cuerpo: null, finalizada: false });
  r.writeHead = (estado, cabeceras) => Object.assign(r, { estado, cabeceras });
  r.end = (cuerpo) => Object.assign(r, { cuerpo, finalizada: true });
  return r;
}

describe('contexto de petición', () => {
  it('lee los query params, el host de la cabecera (o localhost si falta)', () => {
    const ctx = crearContexto({ url: '/x?q=ana&page=2', headers: { host: 'ejemplo.test:9' } }, respuestaFalsa());
    expect(ctx.query).toEqual({ q: 'ana', page: '2' });
    expect(ctx.url.host).toBe('ejemplo.test:9');
    expect(crearContexto({ headers: {} }, respuestaFalsa()).url.host).toBe('localhost');
    expect(crearContexto({ headers: {} }, respuestaFalsa()).url.pathname).toBe('/');
  });

  it('json() responde con tipo, caché desactivada y nosniff', () => {
    const res = respuestaFalsa();
    crearContexto({ url: '/', headers: {} }, res).json(201, { ok: true });
    expect(res.estado).toBe(201);
    expect(res.cabeceras).toEqual({
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    });
    expect(JSON.parse(res.cuerpo)).toEqual({ ok: true });
  });

  it('sinContenido() responde 204 con las cabeceras indicadas', () => {
    const res = respuestaFalsa();
    crearContexto({ url: '/', headers: {} }, res).sinContenido({ 'cache-control': 'no-store' });
    expect(res.estado).toBe(204);
    expect(res.cabeceras).toEqual({ 'cache-control': 'no-store' });
    expect(res.finalizada).toBe(true);
  });

  it('leerJson() sin el middleware de cuerpo es un error de programación', async () => {
    await expect(crearContexto({ url: '/', headers: {} }, respuestaFalsa()).leerJson()).rejects.toThrow(/cuerpoJson/);
  });
});

describe('manejador de errores', () => {
  it('un ErrorHttp se envía con su código, su mensaje y sus campos extra', () => {
    const res = respuestaFalsa();
    manejarErrores(crearContexto({ url: '/', headers: {} }, res), conflicto('Repetido.', { email: 'x' }));
    expect(res.estado).toBe(409);
    expect(JSON.parse(res.cuerpo)).toEqual({ error: 'conflict', message: 'Repetido.', errores: { email: 'x' } });
  });

  it('cualquier otra excepción es un 500 genérico; el detalle solo va a la consola', () => {
    const res = respuestaFalsa();
    const consola = vi.spyOn(console, 'error').mockImplementation(() => {});
    manejarErrores(crearContexto({ url: '/', headers: {} }, res), new TypeError('secreto interno'));
    expect(res.estado).toBe(500);
    const cuerpo = JSON.parse(res.cuerpo);
    expect(cuerpo.error).toBe('internal_error');
    expect(cuerpo.message).not.toContain('secreto interno');
    expect(consola).toHaveBeenCalledTimes(1);
    consola.mockRestore();
  });

  it('un ErrorHttp sin campos extra no añade nada', () => {
    const res = respuestaFalsa();
    manejarErrores(crearContexto({ url: '/', headers: {} }, res), new ErrorHttp(418, 'tetera', 'Soy una tetera.'));
    expect(JSON.parse(res.cuerpo)).toEqual({ error: 'tetera', message: 'Soy una tetera.' });
  });
});
