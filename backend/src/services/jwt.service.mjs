import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * JWT HS256 sin dependencias. Un servicio de infraestructura: no sabe nada de usuarios ni de roles, solo firma,
 * verifica y controla la caducidad. `ahora` se inyecta para poder probar la caducidad sin esperar.
 */
export function crearServicioJwt({ secreto, emisor, duracionSegundos, ahora = () => Math.floor(Date.now() / 1000) }) {
  const firmar = (texto) => createHmac('sha256', secreto).update(texto).digest('base64url');

  return {
    duracionSegundos,

    emitir(payload) {
      const iat = ahora();
      const cabecera = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
      const claims = Buffer.from(JSON.stringify({ ...payload, iss: emisor, iat, exp: iat + duracionSegundos })).toString('base64url');
      const sinFirmar = `${cabecera}.${claims}`;
      return `${sinFirmar}.${firmar(sinFirmar)}`;
    },

    /** Devuelve el payload si el token es válido y no ha caducado; si no, `null`. */
    verificar(token) {
      const [cabecera, claims, firma, extra] = token.split('.');
      if (!cabecera || !claims || !firma || extra) return null;

      const esperada = createHmac('sha256', secreto).update(`${cabecera}.${claims}`).digest();
      const recibida = Buffer.from(firma, 'base64url');
      if (recibida.length !== esperada.length || !timingSafeEqual(recibida, esperada)) return null;

      try {
        const header = JSON.parse(Buffer.from(cabecera, 'base64url').toString('utf8'));
        const payload = JSON.parse(Buffer.from(claims, 'base64url').toString('utf8'));
        if (header.alg !== 'HS256' || payload.iss !== emisor || payload.exp <= ahora()) return null;
        return payload;
      } catch {
        return null;
      }
    },
  };
}
