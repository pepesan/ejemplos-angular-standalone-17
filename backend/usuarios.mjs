import { DatabaseSync } from 'node:sqlite';

/**
 * CRUD básico de usuarios sobre SQLite EN MEMORIA (módulo nativo `node:sqlite`, sin dependencias).
 * Los datos viven mientras el proceso está arrancado: al reiniciar el backend vuelven los 3 de ejemplo.
 */
const ROLES = ['alumno', 'profesor', 'admin'];
const COLUMNAS_ORDENABLES = ['id', 'nombre', 'email', 'rol'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function crearRepositorioUsuarios() {
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE usuarios (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email  TEXT NOT NULL UNIQUE COLLATE NOCASE,
      rol    TEXT NOT NULL CHECK (rol IN ('alumno', 'profesor', 'admin'))
    )
  `);

  // Consultas preparadas: los valores viajan como parámetros (?), nunca concatenados al SQL.
  const insertar = db.prepare('INSERT INTO usuarios (nombre, email, rol) VALUES (?, ?, ?)');
  const actualizar = db.prepare('UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?');
  const borrar = db.prepare('DELETE FROM usuarios WHERE id = ?');
  const porId = db.prepare('SELECT id, nombre, email, rol FROM usuarios WHERE id = ?');

  const repositorio = {
    /**
     * Filtra, ordena y pagina EN EL SERVIDOR. Los valores del usuario van como parámetros (?);
     * la columna y el sentido del orden NO pueden ir como parámetro, así que se validan contra
     * una lista blanca antes de insertarlos en el SQL (nunca se concatena texto del cliente).
     */
    listar: ({ q = '', page = 1, size = 5, sort = 'id', dir = 'asc' } = {}) => {
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
    crear: ({ nombre, email, rol }) => repositorio.obtener(Number(insertar.run(nombre, email, rol).lastInsertRowid)),
    actualizar: (id, { nombre, email, rol }) => (actualizar.run(nombre, email, rol, id).changes ? repositorio.obtener(id) : null),
    borrar: (id) => borrar.run(id).changes > 0,
  };

  // Datos de ejemplo suficientes para que la paginación, el filtro y el orden tengan sentido.
  const nombres = ['Ana López', 'Luis Pérez', 'Marta Ruiz', 'Carlos Gil', 'Elena Mora', 'Pablo Sanz', 'Lucía Vega',
    'Diego Ríos', 'Sara Núñez', 'Jorge Cano', 'Irene Prado', 'Hugo Lara', 'Julia Ortega', 'Raúl Soto',
    'Nuria Campos', 'Álvaro Pino', 'Clara Rey', 'Mario Vidal', 'Laura Bravo', 'Iván Herrera',
    'Paula Marín', 'Sergio Cruz', 'Alba Crespo'];
  nombres.forEach((nombre, i) => {
    const email = `${nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ')[0].toLowerCase()}@example.com`;
    repositorio.crear({ nombre, email, rol: ROLES[i % 3] });
  });
  return repositorio;
}

/** Valida el cuerpo y devuelve `{ datos }` o `{ errores }` (un mensaje por campo). */
export function validarUsuario(cuerpo) {
  const errores = {};
  const nombre = typeof cuerpo?.nombre === 'string' ? cuerpo.nombre.trim() : '';
  const email = typeof cuerpo?.email === 'string' ? cuerpo.email.trim() : '';
  const rol = cuerpo?.rol;
  if (nombre.length < 2 || nombre.length > 80) errores.nombre = 'El nombre debe tener entre 2 y 80 caracteres.';
  if (!EMAIL.test(email) || email.length > 120) errores.email = 'El email no es válido.';
  if (!ROLES.includes(rol)) errores.rol = `El rol debe ser uno de: ${ROLES.join(', ')}.`;
  return Object.keys(errores).length ? { errores } : { datos: { nombre, email, rol } };
}

/**
 * Atiende `/api/usuarios` y `/api/usuarios/:id`. Devuelve true si la ruta era de usuarios.
 * SEGURIDAD: todo exige un JWT válido (401). Leer lo puede hacer cualquier usuario autenticado, pero
 * crear, editar y borrar solo el rol `admin` (403): autenticación (quién eres) y autorización (qué puedes).
 * Códigos: 200 lectura/edición, 201 alta, 204 baja, 400 validación, 401 sin sesión, 403 sin permiso,
 * 404 no existe, 409 email repetido.
 */
export async function manejarUsuarios(repositorio, { request, url, send, readJson, autenticar }, response) {
  const coincidencia = /^\/api\/usuarios(?:\/(\d+))?$/.exec(url.pathname);
  if (!coincidencia) return false;
  const claims = autenticar(request, response);
  if (!claims) return true;
  const id = coincidencia[1] ? Number(coincidencia[1]) : null;
  if (request.method !== 'GET' && claims.role !== 'admin') {
    send(response, 403, { error: 'forbidden', message: 'Solo un administrador puede crear, editar o borrar usuarios.' });
    return true;
  }
  const noEncontrado = () => send(response, 404, { error: 'not_found', message: 'No existe ese usuario.' });

  const guardar = (operacion, datos) => {
    try {
      return operacion(datos);
    } catch (error) {
      if (String(error?.message).includes('UNIQUE')) {
        send(response, 409, { error: 'conflict', message: 'Ya existe un usuario con ese email.', errores: { email: 'Ese email ya está en uso.' } });
        return undefined;
      }
      throw error;
    }
  };

  if (id === null && request.method === 'GET') {
    const parametros = Object.fromEntries(url.searchParams);
    send(response, 200, repositorio.listar(parametros));
  } else if (id === null && request.method === 'POST') {
    const { datos, errores } = validarUsuario(await readJson(request));
    if (errores) return send(response, 400, { error: 'validation', message: 'Datos no válidos.', errores }), true;
    const creado = guardar(repositorio.crear, datos);
    if (creado) send(response, 201, creado);
  } else if (id !== null && request.method === 'GET') {
    const usuario = repositorio.obtener(id);
    usuario ? send(response, 200, usuario) : noEncontrado();
  } else if (id !== null && request.method === 'PUT') {
    const { datos, errores } = validarUsuario(await readJson(request));
    if (errores) return send(response, 400, { error: 'validation', message: 'Datos no válidos.', errores }), true;
    if (!repositorio.obtener(id)) return noEncontrado(), true;
    const editado = guardar((d) => repositorio.actualizar(id, d), datos);
    if (editado) send(response, 200, editado);
  } else if (id !== null && request.method === 'DELETE') {
    if (repositorio.borrar(id)) {
      response.writeHead(204, { 'cache-control': 'no-store' });
      response.end();
    } else noEncontrado();
  } else {
    send(response, 405, { error: 'method_not_allowed', message: 'Método no permitido en este recurso.' });
  }
  return true;
}
