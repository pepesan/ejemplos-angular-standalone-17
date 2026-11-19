import { cargarConfig } from '../src/config/config.mjs';
import { crearApp } from '../src/app.mjs';

/** Arranca la aplicación en un puerto libre con su propia base de datos (en memoria por defecto). */
export async function arrancar({ env = {}, argv = [] } = {}) {
  const config = cargarConfig({ env: { JWT_SECRET: 'secreto-de-pruebas', ...env }, argv, cwd: process.cwd() });
  const app = crearApp(config);
  await new Promise((resolver) => app.servidor.listen(0, '127.0.0.1', resolver));
  const base = `http://127.0.0.1:${app.servidor.address().port}`;
  return { app, base, cerrar: () => app.cerrar() };
}

/** Pide un token para la cuenta indicada. */
export async function tokenDe(base, usuario) {
  const respuesta = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: usuario, password: 'angular' }),
  });
  return (await respuesta.json()).accessToken;
}
