/**
 * Punto de entrada del backend. `arrancar()` se puede importar desde las pruebas sin efectos globales; el proceso
 * (escuchar de verdad, señales de cierre) solo se activa cuando este fichero se ejecuta directamente.
 * Uso: `npm run backend` (desde la raíz del proyecto). Configuración: `backend/.env` (ver `backend/.env.example`).
 */
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { crearApp } from './src/app.mjs';
import { cargarConfig } from './src/config/config.mjs';

/**
 * Crea la aplicación y empieza a escuchar. Devuelve una promesa con la aplicación cuando el servidor ya está listo.
 * `puerto` permite usar 0 (puerto libre) en las pruebas; `log` y `warn` son sustituibles para capturar los avisos.
 */
export function arrancar(config = cargarConfig(), { puerto = config.puerto, log = console.log, warn = console.warn } = {}) {
  const app = crearApp(config);
  return new Promise((resolver) => {
    app.servidor.listen(puerto, config.host, () => {
      const bd = config.baseDeDatos.enMemoria
        ? 'SQLite en memoria (se pierde al parar el servidor)'
        : `SQLite en fichero ${config.baseDeDatos.archivo}`;
      log(`Backend didáctico disponible en http://${config.host}:${app.servidor.address().port}`);
      log(`Base de datos: ${bd}`);
      log('Usuarios demo (contraseña angular): alumno (solo lectura), admin (CRUD completo)');
      if (config.jwt.secretoDeDesarrollo) {
        warn('JWT_SECRET no está definido; se usa una clave pública solo para desarrollo local.');
      }
      resolver(app);
    });
  });
}

const esPuntoDeEntrada = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (esPuntoDeEntrada) {
  const app = await arrancar();
  for (const senal of ['SIGINT', 'SIGTERM']) {
    process.on(senal, async () => {
      await app.cerrar();
      process.exit(0);
    });
  }
}
