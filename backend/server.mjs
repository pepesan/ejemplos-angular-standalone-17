/**
 * Punto de entrada: solo arranca la aplicación. Toda la lógica está en `src/`.
 * Uso: `npm run backend` (desde la raíz del proyecto). Configuración: `backend/.env` (ver `backend/.env.example`).
 */
import { crearApp } from './src/app.mjs';
import { cargarConfig } from './src/config/config.mjs';

const config = cargarConfig();
const app = crearApp(config);

app.servidor.listen(config.puerto, config.host, () => {
  const bd = config.baseDeDatos.enMemoria ? 'SQLite en memoria (se pierde al parar el servidor)' : `SQLite en fichero ${config.baseDeDatos.archivo}`;
  console.log(`Backend didáctico disponible en http://${config.host}:${config.puerto}`);
  console.log(`Base de datos: ${bd}`);
  console.log('Usuarios demo (contraseña angular): alumno (solo lectura), admin (CRUD completo)');
  if (config.jwt.secretoDeDesarrollo) {
    console.warn('JWT_SECRET no está definido; se usa una clave pública solo para desarrollo local.');
  }
});

for (const senal of ['SIGINT', 'SIGTERM']) {
  process.on(senal, async () => {
    await app.cerrar();
    process.exit(0);
  });
}
