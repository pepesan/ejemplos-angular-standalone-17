export function crearAuthController(servicio) {
  return {
    login: async (ctx) => ctx.json(200, servicio.login((await ctx.leerJson()) ?? {})),
    perfil: (ctx) => ctx.json(200, servicio.perfil(ctx.claims)),
  };
}
