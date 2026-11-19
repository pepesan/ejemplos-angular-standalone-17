import { resolve } from 'node:path';

/**
 * Configuración del backend. Todo lo que cambia entre entornos se lee AQUÍ, una sola vez; el resto del código recibe
 * el objeto `config` y no vuelve a leer `process.env`.
 *
 * Precedencia: argumento de línea de comandos > variable de entorno > valor por defecto.
 * Una variable definida pero VACÍA cuenta como no definida (así `JWT_SECRET=` en un `.env` no deja el secreto vacío).
 * Variables (ver `backend/.env.example`): PORT, HOST, JWT_SECRET, CORS_ORIGINS, LOG_REQUESTS, DB_FILE, DB_SEED.
 * Argumentos: --port=, --db-file=, --db-seed=.
 */
const SECRETO_DE_DESARROLLO = 'solo-para-demostraciones-locales';
const ORIGENES_POR_DEFECTO = ['http://localhost:4200', 'http://127.0.0.1:4200'];

/** Valor de un argumento `--nombre=valor`, o `undefined`. */
function argumento(argv, nombre) {
  const prefijo = `--${nombre}=`;
  const encontrado = argv.find((a) => a.startsWith(prefijo));
  return encontrado?.slice(prefijo.length).trim() || undefined;
}

/** Valor de una variable de entorno, o `undefined` si no existe o está vacía. */
const variable = (env, nombre) => env[nombre]?.trim() || undefined;

/** `true`/`false` a partir de texto; sin valor, devuelve el por defecto. */
function booleano(valor, porDefecto) {
  if (valor === undefined) return porDefecto;
  return !['0', 'false', 'no'].includes(valor.toLowerCase());
}

export function cargarConfig({ env = process.env, argv = process.argv.slice(2), cwd = process.cwd() } = {}) {
  const dbFile = argumento(argv, 'db-file') ?? variable(env, 'DB_FILE');
  // Sin ruta, o `:memory:`, la base de datos vive en memoria y se pierde al parar el servidor.
  const enMemoria = dbFile === undefined || dbFile === ':memory:';
  const secreto = variable(env, 'JWT_SECRET') ?? SECRETO_DE_DESARROLLO;

  return {
    puerto: Number(argumento(argv, 'port') ?? variable(env, 'PORT') ?? 3001),
    host: variable(env, 'HOST') ?? '127.0.0.1',
    jwt: {
      secreto,
      secretoDeDesarrollo: secreto === SECRETO_DE_DESARROLLO,
      emisor: 'angular-course-demo',
      duracionSegundos: 900,
    },
    cors: {
      origenes: variable(env, 'CORS_ORIGINS')?.split(',').map((o) => o.trim()).filter(Boolean) ?? ORIGENES_POR_DEFECTO,
    },
    limiteCuerpoBytes: 16_384,
    registrarPeticiones: booleano(variable(env, 'LOG_REQUESTS'), false),
    baseDeDatos: {
      enMemoria,
      archivo: enMemoria ? ':memory:' : resolve(cwd, dbFile),
      // Con `true`, si la tabla está vacía se cargan los usuarios de ejemplo (en un fichero, solo la primera vez).
      sembrar: booleano(argumento(argv, 'db-seed') ?? variable(env, 'DB_SEED'), true),
    },
  };
}
