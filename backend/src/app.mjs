import { createServer } from 'node:http';
import { cargarConfig } from './config/config.mjs';
import { abrirBaseDeDatos } from './database/conexion.mjs';
import { sembrarUsuarios } from './database/semilla.mjs';
import { crearContexto } from './http/contexto.mjs';
import { crearRouter } from './http/router.mjs';
import { crearAuthController } from './controllers/auth.controller.mjs';
import { crearDatosController } from './controllers/datos.controller.mjs';
import { crearUsuariosController } from './controllers/usuarios.controller.mjs';
import { crearCatalogoRepositorio } from './repositories/catalogo.repository.mjs';
import { crearRepositorioUsuarios } from './repositories/usuarios.repository.mjs';
import { registrarRutas } from './routes/index.mjs';
import { cors } from './middleware/cors.mjs';
import { cuerpoJson } from './middleware/cuerpo-json.mjs';
import { manejarErrores } from './middleware/errores.mjs';
import { registrarPeticion } from './middleware/registro.mjs';
import { requerirAdmin, requerirSesion } from './middleware/sesion.mjs';
import { crearAuthService } from './services/auth.service.mjs';
import { crearCatalogoService } from './services/catalogo.service.mjs';
import { crearServicioJwt } from './services/jwt.service.mjs';
import { crearUsuariosService } from './services/usuarios.service.mjs';

/**
 * Composición de la aplicación (inyección de dependencias a mano): aquí se crean las piezas y se conectan entre sí.
 * Cada una recibe lo que necesita; así las pruebas pueden sustituir cualquiera (p. ej. otra base de datos).
 *
 *   config → base de datos → repositorios → servicios → controladores → rutas → servidor HTTP
 */
export function crearApp(config = cargarConfig()) {
  const db = abrirBaseDeDatos(config.baseDeDatos);
  const repositorioUsuarios = crearRepositorioUsuarios(db);
  if (config.baseDeDatos.sembrar && repositorioUsuarios.contar() === 0) sembrarUsuarios(repositorioUsuarios);

  const jwt = crearServicioJwt({
    secreto: config.jwt.secreto,
    emisor: config.jwt.emisor,
    duracionSegundos: config.jwt.duracionSegundos,
  });

  const router = crearRouter();
  router.use(cors(config.cors.origenes));
  if (config.registrarPeticiones) router.use(registrarPeticion);
  router.use(cuerpoJson(config.limiteCuerpoBytes));
  router.alFallar(manejarErrores);

  registrarRutas(router, {
    usuarios: crearUsuariosController(crearUsuariosService({ repositorio: repositorioUsuarios })),
    auth: crearAuthController(crearAuthService({ jwt })),
    datos: crearDatosController(crearCatalogoService({ repositorio: crearCatalogoRepositorio() })),
    requerirSesion: requerirSesion(jwt),
    requerirAdmin,
  });

  const servidor = createServer((solicitud, respuesta) => router.atender(crearContexto(solicitud, respuesta)));

  return {
    servidor,
    config,
    /** Cierra el servidor, las conexiones abiertas y la base de datos. */
    cerrar() {
      return new Promise((resolver) => {
        servidor.closeAllConnections?.();
        servidor.close(() => {
          db.close();
          resolver();
        });
      });
    },
  };
}
