import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { crearServicioJwt } from '../src/services/jwt.service.mjs';

const SECRETO = 'secreto-de-pruebas';
const b64 = (texto) => Buffer.from(texto).toString('base64url');
/** Firma a mano un token con el secreto dado: sirve para construir tokens con cabecera o payload defectuosos. */
const firmado = (cabecera, payload) => {
  const sinFirmar = `${b64(JSON.stringify(cabecera))}.${b64(JSON.stringify(payload))}`;
  return `${sinFirmar}.${createHmac('sha256', SECRETO).update(sinFirmar).digest('base64url')}`;
};

describe('servicio JWT', () => {
  const reloj = { t: 1_000_000 };
  const jwt = crearServicioJwt({ secreto: SECRETO, emisor: 'emisor-test', duracionSegundos: 900, ahora: () => reloj.t });

  it('un token recién emitido se verifica y devuelve su payload', () => {
    const payload = jwt.verificar(jwt.emitir({ sub: 'u1', role: 'admin' }));
    expect(payload).toMatchObject({ sub: 'u1', role: 'admin', iss: 'emisor-test', iat: 1_000_000, exp: 1_000_900 });
  });

  it('un token caduca cuando pasa su duración', () => {
    const token = jwt.emitir({ sub: 'u1' });
    reloj.t += 901;
    expect(jwt.verificar(token)).toBeNull();
    reloj.t -= 901;
  });

  it('una firma alterada o de otro secreto no vale', () => {
    const token = jwt.emitir({ sub: 'u1' });
    expect(jwt.verificar(token.replace(/\.[^.]+$/, '.AAAA'))).toBeNull();
    const otro = crearServicioJwt({ secreto: 'otro', emisor: 'emisor-test', duracionSegundos: 900, ahora: () => reloj.t });
    expect(jwt.verificar(otro.emitir({ sub: 'u1' }))).toBeNull();
  });

  it('formatos rotos o de otro emisor se rechazan sin lanzar', () => {
    expect(jwt.verificar('solo.dos')).toBeNull();
    expect(jwt.verificar('a.b.c.d')).toBeNull();
    expect(jwt.verificar('')).toBeNull();
    const ajeno = crearServicioJwt({ secreto: SECRETO, emisor: 'otro-emisor', duracionSegundos: 900, ahora: () => reloj.t });
    expect(jwt.verificar(ajeno.emitir({ sub: 'u1' }))).toBeNull();
  });

  it('un algoritmo distinto de HS256 se rechaza aunque la firma sea válida para el secreto', () => {
    const exp = reloj.t + 60;
    expect(jwt.verificar(firmado({ alg: 'HS512', typ: 'JWT' }, { iss: 'emisor-test', exp }))).toBeNull();
  });

  it('una cabecera o un payload que no son JSON se rechazan con firma válida', () => {
    const sinFirmar = (cabecera, claims) => {
      const base = `${cabecera}.${claims}`;
      return `${base}.${createHmac('sha256', SECRETO).update(base).digest('base64url')}`;
    };
    expect(jwt.verificar(sinFirmar(b64('no es json'), b64('{}')))).toBeNull();
    expect(jwt.verificar(sinFirmar(b64('{"alg":"HS256"}'), b64('no es json')))).toBeNull();
  });
});
