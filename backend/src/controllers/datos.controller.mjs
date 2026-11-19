import { noDisponible } from '../errores.mjs';

/** Endpoints de la demo que no son de usuarios: salud, resultados, cursos, recursos y un error de prueba. */
export function crearDatosController(catalogo) {
  return {
    salud: (ctx) => ctx.json(200, { status: 'ok' }),
    resultados: (ctx) => ctx.json(200, catalogo.resultados()),
    cursos: (ctx) => ctx.json(200, catalogo.cursos(ctx.query.q)),
    recurso: (ctx) => ctx.json(200, catalogo.recurso(ctx.params.id)),
    errorDemo() {
      throw noDisponible('Error de demostración del servidor.');
    },
  };
}
