/** Resultados, cursos y recursos de la demo. Aquí van las reglas (p. ej. el filtro de cursos sin distinguir tildes). */
export function crearCatalogoService({ repositorio }) {
  return {
    resultados: () => repositorio.resultados(),
    cursos(q = '') {
      const termino = q.trim().toLocaleLowerCase('es');
      const cursos = repositorio.cursos();
      return termino ? cursos.filter((curso) => curso.nombre.toLocaleLowerCase('es').includes(termino)) : cursos;
    },
    recurso: (id) => ({ id, title: `Recurso ${id}`, source: 'backend local' }),
  };
}
