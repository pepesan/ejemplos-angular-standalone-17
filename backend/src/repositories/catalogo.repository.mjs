import { CURSOS_DEMO, RESULTADOS_DEMO } from '../data/datos-demo.mjs';

/** Datos de la demo que no están en la base de datos (resultados y cursos). Fijos: no cambian entre peticiones. */
export function crearCatalogoRepositorio() {
  return {
    resultados: () => RESULTADOS_DEMO,
    cursos: () => CURSOS_DEMO,
  };
}
