import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { crearServicioJwt } from '../src/services/jwt.service.mjs';

describe('servicio JWT', () => {
  const reloj = { t: 1_000_000 };
  const jwt = crearServicioJwt({ secreto: 'x', emisor: 'emisor-test', duracionSegundos: 900, ahora: () => reloj.t });

  it('un token recién emitido se verifica y devuelve su payload', () => {
    const payload = jwt.verificar(jwt.emitir({ sub: 'u1', role: 'admin' }));
    assert.equal(payload.sub, 'u1');
    assert.equal(payload.iss, 'emisor-test');
    assert.equal(payload.exp, reloj.t + 900);
  });

  it('un token caduca cuando pasa su duración', () => {
    const token = jwt.emitir({ sub: 'u1' });
    reloj.t += 901;
    assert.equal(jwt.verificar(token), null);
    reloj.t -= 901;
  });

  it('una firma alterada o de otro secreto no vale', () => {
    const token = jwt.emitir({ sub: 'u1' });
    const manipulado = token.replace(/\.[^.]+$/, '.AAAA');
    assert.equal(jwt.verificar(manipulado), null);
    const otro = crearServicioJwt({ secreto: 'otro', emisor: 'emisor-test', duracionSegundos: 900, ahora: () => reloj.t });
    assert.equal(jwt.verificar(otro.emitir({ sub: 'u1' })), null);
  });

  it('formatos rotos o de otro emisor se rechazan sin lanzar', () => {
    assert.equal(jwt.verificar('solo.dos'), null);
    assert.equal(jwt.verificar('a.b.c.d'), null);
    assert.equal(jwt.verificar(''), null);
    const ajeno = crearServicioJwt({ secreto: 'x', emisor: 'otro-emisor', duracionSegundos: 900, ahora: () => reloj.t });
    assert.equal(jwt.verificar(ajeno.emitir({ sub: 'u1' })), null);
  });
});
