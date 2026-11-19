import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { arrancar, tokenDe } from './ayudas.mjs';

/** Pruebas de la API completa, con HTTP real y base de datos en memoria. */
describe('API del backend', () => {
  let base;
  let cerrar;
  let admin;
  let alumno;

  before(async () => {
    ({ base, cerrar } = await arrancar());
    admin = await tokenDe(base, 'admin');
    alumno = await tokenDe(base, 'alumno');
  });
  after(() => cerrar());

  const pedir = (ruta, { metodo = 'GET', token, cuerpo, cabeceras = {} } = {}) =>
    fetch(`${base}${ruta}`, {
      method: metodo,
      headers: {
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(cuerpo !== undefined ? { 'content-type': 'application/json' } : {}),
        ...cabeceras,
      },
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  const json = async (respuesta) => respuesta.json();

  describe('endpoints públicos de la demo', () => {
    it('salud, resultados, cursos y recurso responden como antes', async () => {
      assert.deepEqual(await json(await pedir('/api/health')), { status: 'ok' });
      assert.equal((await json(await pedir('/api/resultados'))).length, 3);
      const cursos = await json(await pedir('/api/cursos?q=angular'));
      assert.deepEqual(cursos.map((c) => c.nombre), ['Angular moderno']);
      assert.deepEqual(await json(await pedir('/api/recursos/42')), { id: '42', title: 'Recurso 42', source: 'backend local' });
    });

    it('el error de demostración devuelve 503', async () => {
      const respuesta = await pedir('/api/demo/error');
      assert.equal(respuesta.status, 503);
      assert.equal((await json(respuesta)).error, 'demo_unavailable');
    });

    it('una ruta que no existe devuelve 404 not_found', async () => {
      const respuesta = await pedir('/api/no-existe');
      assert.equal(respuesta.status, 404);
      assert.equal((await json(respuesta)).error, 'not_found');
    });

    it('un método que el recurso no admite devuelve 405 con la cabecera Allow', async () => {
      const respuesta = await pedir('/api/health', { metodo: 'DELETE' });
      assert.equal(respuesta.status, 405);
      assert.equal(respuesta.headers.get('allow'), 'GET');
    });

    it('las respuestas JSON llevan cabeceras de seguridad', async () => {
      const respuesta = await pedir('/api/health');
      assert.equal(respuesta.headers.get('cache-control'), 'no-store');
      assert.equal(respuesta.headers.get('x-content-type-options'), 'nosniff');
    });
  });

  describe('CORS', () => {
    it('un origen permitido recibe cabeceras y el preflight responde 204', async () => {
      const respuesta = await pedir('/api/usuarios', { metodo: 'OPTIONS', cabeceras: { origin: 'http://localhost:4200' } });
      assert.equal(respuesta.status, 204);
      assert.equal(respuesta.headers.get('access-control-allow-origin'), 'http://localhost:4200');
    });

    it('un origen no permitido no recibe cabeceras CORS', async () => {
      const respuesta = await pedir('/api/health', { cabeceras: { origin: 'https://malo.example' } });
      assert.equal(respuesta.headers.get('access-control-allow-origin'), null);
    });
  });

  describe('autenticación', () => {
    it('login correcto devuelve un JWT con 900 segundos de duración', async () => {
      const respuesta = await pedir('/api/auth/login', { metodo: 'POST', cuerpo: { username: 'admin', password: 'angular' } });
      const cuerpo = await json(respuesta);
      assert.equal(cuerpo.tokenType, 'Bearer');
      assert.equal(cuerpo.expiresInSeconds, 900);
      assert.equal(cuerpo.accessToken.split('.').length, 3);
    });

    it('contraseña incorrecta o usuario inexistente devuelven 401 invalid_credentials', async () => {
      for (const cuerpo of [{ username: 'admin', password: 'otra' }, { username: 'nadie', password: 'angular' }]) {
        const respuesta = await pedir('/api/auth/login', { metodo: 'POST', cuerpo });
        assert.equal(respuesta.status, 401);
        assert.equal((await json(respuesta)).error, 'invalid_credentials');
      }
    });

    it('un nombre de propiedad heredada de Object no inicia sesión', async () => {
      const respuesta = await pedir('/api/auth/login', { metodo: 'POST', cuerpo: { username: 'constructor', password: 'angular' } });
      assert.equal(respuesta.status, 401);
    });

    it('el perfil exige token válido y devuelve id, nombre y rol', async () => {
      assert.equal((await pedir('/api/auth/profile')).status, 401);
      assert.equal((await pedir('/api/auth/profile', { token: 'basura' })).status, 401);
      const perfil = await json(await pedir('/api/auth/profile', { token: admin }));
      assert.deepEqual(perfil, { id: 'admin-1', name: 'Administrador de demostración', role: 'admin' });
    });
  });

  describe('usuarios: autenticación y autorización', () => {
    it('sin token, 401 en todas las operaciones', async () => {
      assert.equal((await pedir('/api/usuarios')).status, 401);
      assert.equal((await pedir('/api/usuarios', { metodo: 'POST', cuerpo: {} })).status, 401);
      assert.equal((await pedir('/api/usuarios/1')).status, 401);
    });

    it('un alumno puede consultar pero no escribir (403)', async () => {
      assert.equal((await pedir('/api/usuarios', { token: alumno })).status, 200);
      const respuesta = await pedir('/api/usuarios', { metodo: 'POST', token: alumno, cuerpo: { nombre: 'Eva', email: 'eva@example.com', rol: 'alumno' } });
      assert.equal(respuesta.status, 403);
      assert.equal((await json(respuesta)).error, 'forbidden');
    });
  });

  describe('usuarios: CRUD como administrador', () => {
    it('listado paginado con 23 usuarios de ejemplo, filtro y orden en el servidor', async () => {
      const todos = await json(await pedir('/api/usuarios?size=5', { token: admin }));
      assert.equal(todos.total, 23);
      assert.equal(todos.items.length, 5);
      const filtrado = await json(await pedir('/api/usuarios?q=ana', { token: admin }));
      assert.ok(filtrado.items.every((u) => /ana/i.test(u.nombre + u.email)));
      const ordenado = await json(await pedir('/api/usuarios?sort=nombre&dir=desc&size=50', { token: admin }));
      // SQLite compara sin distinguir mayúsculas solo en ASCII: se replica esa regla para no depender de tildes.
      const clave = (texto) => texto.replace(/[A-Z]/g, (c) => c.toLowerCase());
      const nombres = ordenado.items.map((u) => clave(u.nombre));
      assert.deepEqual(nombres, [...nombres].sort().reverse());
    });

    it('ordenar por una columna desconocida usa el id (lista blanca, sin SQL inyectado)', async () => {
      const respuesta = await pedir('/api/usuarios?sort=id;DROP%20TABLE%20usuarios', { token: admin });
      assert.equal(respuesta.status, 200);
      assert.equal((await json(await pedir('/api/usuarios?size=1', { token: admin }))).total, 23);
    });

    it('crea (201), lee, edita (200), repite email (409) y borra (204)', async () => {
      const alta = await pedir('/api/usuarios', { metodo: 'POST', token: admin, cuerpo: { nombre: 'Eva Gil', email: 'eva.gil@example.com', rol: 'profesor' } });
      assert.equal(alta.status, 201);
      const creado = await json(alta);
      assert.equal(creado.nombre, 'Eva Gil');
      assert.equal((await pedir('/api/usuarios', { metodo: 'POST', token: admin, cuerpo: { nombre: 'Otra', email: 'EVA.GIL@example.com', rol: 'alumno' } })).status, 409);
      assert.equal((await pedir(`/api/usuarios/${creado.id}`, { token: admin })).status, 200);

      const editado = await pedir(`/api/usuarios/${creado.id}`, { metodo: 'PUT', token: admin, cuerpo: { nombre: 'Eva Gil Pérez', email: 'eva.gil@example.com', rol: 'admin' } });
      assert.equal(editado.status, 200);
      assert.equal((await json(editado)).rol, 'admin');

      assert.equal((await pedir(`/api/usuarios/${creado.id}`, { metodo: 'DELETE', token: admin })).status, 204);
      assert.equal((await pedir(`/api/usuarios/${creado.id}`, { metodo: 'DELETE', token: admin })).status, 404);
    });

    it('validación: 400 con un mensaje por campo', async () => {
      const respuesta = await pedir('/api/usuarios', { metodo: 'POST', token: admin, cuerpo: { nombre: 'x', email: 'no', rol: 'dios' } });
      assert.equal(respuesta.status, 400);
      const cuerpo = await json(respuesta);
      assert.equal(cuerpo.error, 'validation');
      assert.deepEqual(Object.keys(cuerpo.errores).sort(), ['email', 'nombre', 'rol']);
    });

    it('JSON inválido devuelve 400 bad_request', async () => {
      const respuesta = await fetch(`${base}/api/usuarios`, {
        method: 'POST',
        headers: { authorization: `Bearer ${admin}`, 'content-type': 'application/json' },
        body: '{no es json',
      });
      assert.equal(respuesta.status, 400);
      assert.equal((await json(respuesta)).error, 'bad_request');
    });

    it('usuario inexistente: 404 al leer, editar y borrar', async () => {
      assert.equal((await pedir('/api/usuarios/9999', { token: admin })).status, 404);
      assert.equal((await pedir('/api/usuarios/9999', { metodo: 'PUT', token: admin, cuerpo: { nombre: 'Ana', email: 'a@example.com', rol: 'alumno' } })).status, 404);
      assert.equal((await pedir('/api/usuarios/9999', { metodo: 'DELETE', token: admin })).status, 404);
    });
  });
});
