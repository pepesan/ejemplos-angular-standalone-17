import { metodoNoPermitido, noEncontrado } from '../errores.mjs';

/**
 * Mini-router con cadena de middleware (estilo Express, sin dependencias).
 *
 * Un middleware es `async (ctx, siguiente) => { ... await siguiente(); ... }`: puede actuar antes y después del
 * siguiente eslabón, o cortar la cadena sin llamar a `siguiente()` (como hace CORS con OPTIONS).
 * `ctx` agrupa lo que necesita cada eslabón: `solicitud`, `respuesta`, `url`, `query`, `params`, `body`,
 * `claims` (el JWT ya verificado) y los helpers `json()` y `sinContenido()`.
 *
 * Patrones de ruta: `/api/usuarios/:id` (el parámetro admite cualquier texto salvo `/`) o con restricción
 * `/api/usuarios/:id(\d+)`.
 */
function compilar(patron) {
  const nombres = [];
  const fuente = patron.replace(/:(\w+)(?:\(([^)]+)\))?/g, (_, nombre, restriccion) => {
    nombres.push(nombre);
    return `(${restriccion ?? '[^/]+'})`;
  });
  return { regex: new RegExp(`^${fuente}$`), nombres };
}

export function crearRouter() {
  /** Middleware global: se ejecuta para TODA petición, en el orden en que se registró. */
  const globales = [];
  const rutas = [];
  /**
   * Manejador de errores: se ejecuta si algo lanza un error en cualquier eslabón. Si no se ha registrado ninguno
   * se RELANZA el error: una petición nunca debe quedarse sin respuesta en silencio.
   */
  let manejadorDeErrores = null;

  const registrar = (metodo) => (patron, ...eslabones) => {
    rutas.push({ metodo, ...compilar(patron), eslabones });
  };

  /** Ejecuta una lista de middleware en cadena. */
  function componer(eslabones) {
    return (ctx) => {
      let ultimo = -1;
      const despachar = async (i) => {
        if (i <= ultimo) throw new Error('`siguiente()` se llamó más de una vez en el mismo middleware.');
        ultimo = i;
        const eslabon = eslabones[i];
        if (!eslabon) return;
        await eslabon(ctx, () => despachar(i + 1));
      };
      return despachar(0);
    };
  }

  /** Busca la ruta: devuelve `{ ruta, params }`, o los métodos permitidos si el camino existe con otro método. */
  function buscar(metodo, camino) {
    const permitidos = new Set();
    for (const ruta of rutas) {
      const m = ruta.regex.exec(camino);
      if (!m) continue;
      if (ruta.metodo === metodo) {
        return { ruta, params: Object.fromEntries(ruta.nombres.map((n, i) => [n, decodeURIComponent(m[i + 1])])) };
      }
      permitidos.add(ruta.metodo);
    }
    return { permitidos: [...permitidos] };
  }

  return {
    use: (...eslabones) => globales.push(...eslabones),
    get: registrar('GET'),
    post: registrar('POST'),
    put: registrar('PUT'),
    delete: registrar('DELETE'),
    alFallar: (manejador) => { manejadorDeErrores = manejador; },

    /** Atiende una petición: middleware global → (ruta o 404/405) → manejador de errores si algo falla. */
    async atender(ctx) {
      const final = async () => {
        const { ruta, params, permitidos } = buscar(ctx.solicitud.method, ctx.url.pathname);
        if (ruta) {
          ctx.params = params;
          await componer(ruta.eslabones)(ctx);
          return;
        }
        if (permitidos?.length) {
          ctx.respuesta.setHeader('allow', permitidos.join(', '));
          throw metodoNoPermitido();
        }
        throw noEncontrado('No existe ese endpoint de demostración.');
      };
      try {
        await componer([...globales, final])(ctx);
      } catch (error) {
        if (!manejadorDeErrores) throw error;
        await manejadorDeErrores(ctx, error);
      }
    },
  };
}
