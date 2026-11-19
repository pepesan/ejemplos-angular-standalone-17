/**
 * Tabla de rutas: el único sitio donde se ve QUÉ endpoint existe, con qué middleware y qué controlador.
 * Orden de los middleware: primero la autenticación (¿quién eres?), después la autorización (¿qué puedes hacer?).
 */
export function registrarRutas(router, { usuarios, auth, datos, requerirSesion, requerirAdmin }) {
  const soloAdmin = requerirAdmin('Solo un administrador puede crear, editar o borrar usuarios.');

  router.get('/api/health', datos.salud);
  router.get('/api/resultados', datos.resultados);
  router.get('/api/cursos', datos.cursos);
  router.get('/api/demo/error', datos.errorDemo);
  router.get('/api/recursos/:id([\\w-]+)', datos.recurso);

  router.post('/api/auth/login', auth.login);
  router.get('/api/auth/profile', requerirSesion, auth.perfil);

  router.get('/api/usuarios', requerirSesion, usuarios.listar);
  router.post('/api/usuarios', requerirSesion, soloAdmin, usuarios.crear);
  router.get('/api/usuarios/:id(\\d+)', requerirSesion, usuarios.obtener);
  router.put('/api/usuarios/:id(\\d+)', requerirSesion, soloAdmin, usuarios.actualizar);
  router.delete('/api/usuarios/:id(\\d+)', requerirSesion, soloAdmin, usuarios.borrar);
}
