/**
 * Acceso a la tabla `usuarios`. Solo SQL: no conoce HTTP, JWT ni validaciones de negocio.
 * Consultas preparadas: los valores viajan como parámetros (?). La columna y el sentido del orden NO pueden ser
 * parámetros, así que se validan contra una lista blanca antes de entrar en el SQL.
 */
const COLUMNAS_ORDENABLES = ['id', 'nombre', 'email', 'rol'];

export function crearRepositorioUsuarios(db) {
  const insertar = db.prepare('INSERT INTO usuarios (nombre, email, rol) VALUES (?, ?, ?)');
  const actualizar = db.prepare('UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?');
  const borrar = db.prepare('DELETE FROM usuarios WHERE id = ?');
  const porId = db.prepare('SELECT id, nombre, email, rol FROM usuarios WHERE id = ?');
  const contar = db.prepare('SELECT COUNT(*) AS total FROM usuarios');

  const repositorio = {
    /** Filtra, ordena y pagina en la base de datos. Devuelve `{ items, total, page, size }`. */
    listar({ q = '', page = 1, size = 5, sort = 'id', dir = 'asc' } = {}) {
      const columna = COLUMNAS_ORDENABLES.includes(sort) ? sort : 'id';
      const sentido = dir === 'desc' ? 'DESC' : 'ASC';
      const tamano = Math.min(Math.max(Number(size) || 5, 1), 50);
      const filtro = `%${q}%`;
      const total = db
        .prepare('SELECT COUNT(*) AS total FROM usuarios WHERE nombre LIKE ? OR email LIKE ?')
        .get(filtro, filtro).total;
      const paginas = Math.max(Math.ceil(total / tamano), 1);
      const pagina = Math.min(Math.max(Number(page) || 1, 1), paginas);
      const items = db
        .prepare(
          `SELECT id, nombre, email, rol FROM usuarios WHERE nombre LIKE ? OR email LIKE ?
           ORDER BY ${columna} COLLATE NOCASE ${sentido}, id ASC LIMIT ? OFFSET ?`,
        )
        .all(filtro, filtro, tamano, (pagina - 1) * tamano);
      return { items: items.map((u) => ({ ...u })), total, page: pagina, size: tamano };
    },
    obtener: (id) => porId.get(id) ?? null,
    /** Inserta y devuelve el usuario creado. Lanza un error con «UNIQUE» si el email ya existe. */
    crear({ nombre, email, rol }) {
      return repositorio.obtener(Number(insertar.run(nombre, email, rol).lastInsertRowid));
    },
    actualizar: (id, { nombre, email, rol }) =>
      actualizar.run(nombre, email, rol, id).changes ? repositorio.obtener(id) : null,
    borrar: (id) => borrar.run(id).changes > 0,
    contar: () => contar.get().total,
  };
  return repositorio;
}
