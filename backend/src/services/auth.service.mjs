import { CLAVE_DEMO, CUENTAS_DEMO } from '../data/datos-demo.mjs';
import { credencialesInvalidas } from '../errores.mjs';

/** Login de las cuentas de demostración y perfil de quien tiene sesión. */
export function crearAuthService({ jwt, cuentas = CUENTAS_DEMO, clave = CLAVE_DEMO }) {
  return {
    login({ username, password } = {}) {
      // `hasOwn`: sin él, un usuario como «constructor» encontraría propiedades heredadas de Object.
      const cuenta = Object.hasOwn(cuentas, username) ? cuentas[username] : null;
      if (!cuenta || password !== clave) throw credencialesInvalidas();
      const accessToken = jwt.emitir({ sub: cuenta.sub, name: cuenta.name, role: cuenta.role });
      return { tokenType: 'Bearer', accessToken, expiresInSeconds: jwt.duracionSegundos };
    },

    perfil: (claims) => ({ id: claims.sub, name: claims.name, role: claims.role }),
  };
}
