/**
 * Controladores de `/api/usuarios`: leen la petición (params, query, cuerpo), llaman al servicio y responden.
 * Ni validan ni hablan con la base de datos: eso es del servicio y del repositorio.
 */
export function crearUsuariosController(servicio) {
  return {
    listar: (ctx) => ctx.json(200, servicio.listar(ctx.query)),
    obtener: (ctx) => ctx.json(200, servicio.obtener(Number(ctx.params.id))),
    crear: async (ctx) => ctx.json(201, servicio.crear(await ctx.leerJson())),
    actualizar: async (ctx) => ctx.json(200, servicio.actualizar(Number(ctx.params.id), await ctx.leerJson())),
    borrar(ctx) {
      servicio.borrar(Number(ctx.params.id));
      ctx.sinContenido({ 'cache-control': 'no-store' });
    },
  };
}
