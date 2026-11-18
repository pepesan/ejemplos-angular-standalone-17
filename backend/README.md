# Backend didáctico de Angular

Este servidor local ofrece datos y endpoints de ejemplo para las lecciones HTTP, búsquedas, routing y JWT. Usa solo módulos nativos de Node.js, sin dependencias adicionales.

## Arranque

En una terminal:

```bash
npm run backend
```

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

## CRUD de usuarios (SQLite en memoria)

`backend/usuarios.mjs` implementa un CRUD sobre `node:sqlite` (módulo nativo de Node 22.5+, sin dependencias). La base vive en memoria: al reiniciar el backend vuelven los 23 usuarios de ejemplo.

- `GET /api/usuarios?q=&page=&size=&sort=&dir=`: lista paginada, filtrada (nombre o email) y ordenada en el servidor. Responde `{ items, total, page, size }`. `sort` solo admite `id`, `nombre`, `email` o `rol` (lista blanca), `dir` es `asc` o `desc` y `size` va de 1 a 50.
- `GET /api/usuarios/:id`: detalle.
- `POST /api/usuarios`, `PUT /api/usuarios/:id`, `DELETE /api/usuarios/:id`: alta (201), edición (200) y baja (204).

Seguridad: todo requiere `Authorization: Bearer <jwt>` (401 si falta o caduca). Consultar lo puede hacer cualquier usuario autenticado; crear, editar y borrar solo el rol `admin` (403 en otro caso). Otros códigos: 400 (validación, con `errores` por campo), 404 y 409 (email repetido).

Cuentas del login (`POST /api/auth/login`, contraseña `angular`): `admin` (CRUD completo) y `alumno` (solo lectura).
