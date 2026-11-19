# Backend didáctico de Angular

Este servidor local ofrece datos y endpoints de ejemplo para las lecciones HTTP, búsquedas, routing y JWT. Usa solo módulos nativos de Node.js, sin dependencias adicionales.

## Arranque

En una terminal:

```bash
npm run backend
```

La configuración se lee de `backend/.env` si existe (plantilla en `backend/.env.example`, que sí se versiona; el `.env` real no). Requiere Node 22.9 o superior, por el flag `--env-file-if-exists`.

En otra terminal:

```bash
npm start
```

Angular reenvía `/api/*` a `http://127.0.0.1:3001` mediante `proxy.conf.json`. También se puede comprobar la disponibilidad con `curl http://127.0.0.1:3001/api/health`.

## Endpoints

- `GET /api/resultados`: lista de ejemplo para el componente de consumo HTTP.
- `GET /api/cursos?q=angular`: búsqueda filtrada para Signals y RxJS.
- `GET /api/recursos/:id`: detalle consumido por el resolver de rutas.
- `POST /api/auth/login`: valida las credenciales de demostración y emite un JWT HS256 de 15 minutos.
- `GET /api/auth/profile`: endpoint protegido que requiere `Authorization: Bearer <token>`.
- `GET /api/demo/error`: responde 503 para mostrar el interceptor global de errores.

Credenciales locales: `alumno` / `angular`.

## Alcance de seguridad

El servidor existe para prácticas locales. La cuenta, los datos y la clave predeterminada no son apropiados para producción. Para probar otra clave, inicia el servidor con `JWT_SECRET='una-clave-local' npm run backend`. En un sistema real, las credenciales, claves, expiración, renovación y almacenamiento de tokens requieren un diseño de seguridad separado; no reutilices este servidor ni sus credenciales.

## Base de datos SQLite: memoria o fichero

El CRUD de usuarios usa `node:sqlite` (módulo nativo, sin dependencias). El mismo código sirve para las dos opciones; solo cambia la configuración:

| Configuración | Resultado |
|---|---|
| `DB_FILE` vacío o `:memory:` (por defecto) | Base en memoria. Se pierde al parar el servidor; cada arranque carga los 23 usuarios de ejemplo. |
| `DB_FILE=./backend/data/usuarios.sqlite` | Base en fichero. Los datos se conservan entre arranques. Los de ejemplo se cargan solo la primera vez (si la tabla está vacía). |
| `DB_SEED=false` | Sin datos de ejemplo: la base empieza vacía. |

También se puede indicar desde la línea de comandos, que gana a la variable de entorno: `node backend/server.mjs --db-file=./backend/data/prueba.sqlite`. La carpeta `backend/data/` está en `.gitignore`.

- `GET /api/usuarios?q=&page=&size=&sort=&dir=`: lista paginada, filtrada (nombre o email) y ordenada en el servidor. Responde `{ items, total, page, size }`. `sort` solo admite `id`, `nombre`, `email` o `rol` (lista blanca), `dir` es `asc` o `desc` y `size` va de 1 a 50.
- `GET /api/usuarios/:id`: detalle.
- `POST /api/usuarios`, `PUT /api/usuarios/:id`, `DELETE /api/usuarios/:id`: alta (201), edición (200) y baja (204).

Seguridad: todo requiere `Authorization: Bearer <jwt>` (401 si falta o caduca). Consultar lo puede hacer cualquier usuario autenticado; crear, editar y borrar solo el rol `admin` (403 en otro caso). Otros códigos: 400 (validación, con `errores` por campo), 404 y 409 (email repetido).

## Arquitectura

El servidor está organizado en capas. Cada una depende solo de la inferior, y la composición está en un único sitio:

```
server.mjs                 arranca el servidor (nada de lógica)
src/app.mjs                compone las piezas (inyección de dependencias a mano)
src/config/                lee toda la configuración en un sitio
src/routes/                tabla de rutas: qué endpoint existe, con qué middleware y controlador
src/middleware/            CORS, cuerpo JSON, sesión y rol, errores y registro de peticiones
src/controllers/           leen la petición, llaman al servicio y responden
src/services/              reglas de negocio y JWT
src/validators/            validación del cuerpo de los usuarios
src/repositories/          SQL: la única capa que habla con la base de datos
src/database/              abre la base (memoria o fichero) y carga los datos de ejemplo
src/http/                  router con cadena de middleware y contexto de petición
src/errores.mjs            errores de la API: se lanzan y el manejador los convierte en JSON
src/data/                  datos fijos de la demo (cuentas, resultados, cursos)
```

Flujo de una petición: `router` → middleware globales (CORS, cuerpo JSON) → middleware de la ruta (sesión, rol) → controlador → servicio → repositorio. Un error lanzado en cualquier punto llega al manejador de errores, que responde `{ error, message, ...extra }`.

## Pruebas

```bash
npm run test:backend
```

Usa `node:test` y no necesita dependencias. Cubre la configuración (memoria y fichero, precedencia de argumentos y variables), la API completa con HTTP real, el router, el JWT, el validador y el repositorio.

Cuentas del login (`POST /api/auth/login`, contraseña `angular`): `admin` (CRUD completo) y `alumno` (solo lectura).

## Cambios respecto a la versión anterior

- Un método que el recurso no admite devuelve **405** con la cabecera `Allow` (antes, en la mayoría de casos, 404).
- Un nombre de usuario como `constructor` ya no inicia sesión (antes, por propiedades heredadas de `Object`, podía emitir un token).
- `JWT_SECRET` vacío se trata como no definido (antes un valor vacío dejaba el secreto en blanco).
