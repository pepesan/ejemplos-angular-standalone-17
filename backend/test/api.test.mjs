import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { arrancar, tokenDe } from './ayudas.mjs';

/** API completa con HTTP real y base de datos en memoria. */
describe('API del backend', () => {
  let base;
  let cerrar;
  let admin;
  let alumno;

  beforeAll(async () => {
    ({ base, cerrar } = await arrancar());
    admin = await tokenDe(base, 'admin');
    alumno = await tokenDe(base, 'alumno');
  });
  afterAll(() => cerrar());

  const pedir = (ruta, { metodo = 'GET', token, cuerpo, raw, cabeceras = {} } = {}) =>
    fetch(`${base}${ruta}`, {
      method: metodo,
      headers: {
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(cuerpo !== undefined || raw !== undefined ? { 'content-type': 'application/json' } : {}),
        ...cabeceras,
      },
      body: raw ?? (cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined),
    });
  const json = (respuesta) => respuesta.json();

  describe('endpoints públicos de la demo', () => {
    it('salud, resultados, cursos y recurso', async () => {
      expect(await json(await pedir('/api/health'))).toEqual({ status: 'ok' });
      expect(await json(await pedir('/api/resultados'))).toHaveLength(3);
      expect((await json(await pedir('/api/cursos?q=angular'))).map((c) => c.nombre)).toEqual(['Angular moderno']);
      expect(await json(await pedir('/api/cursos'))).toHaveLength(4);
      expect(await json(await pedir('/api/recursos/42'))).toEqual({ id: '42', title: 'Recurso 42', source: 'backend local' });
    });

    it('el error de demostración devuelve 503', async () => {
      const respuesta = await pedir('/api/demo/error');
      expect(respuesta.status).toBe(503);
      expect((await json(respuesta)).error).toBe('demo_unavailable');
    });

    it('una ruta inexistente devuelve 404 not_found', async () => {
      const respuesta = await pedir('/api/no-existe');
      expect(respuesta.status).toBe(404);
      expect((await json(respuesta)).error).toBe('not_found');
    });

    it('un método no admitido devuelve 405 con la cabecera Allow', async () => {
      const respuesta = await pedir('/api/health', { metodo: 'DELETE' });
      expect(respuesta.status).toBe(405);
      expect(respuesta.headers.get('allow')).toBe('GET');
    });

    it('las respuestas JSON llevan cabeceras de seguridad', async () => {
      const respuesta = await pedir('/api/health');
      expect(respuesta.headers.get('cache-control')).toBe('no-store');
      expect(respuesta.headers.get('x-content-type-options')).toBe('nosniff');
    });

    it('un recurso de demostración con caracteres no válidos no coincide', async () => {
      expect((await pedir('/api/recursos/a.b')).status).toBe(404);
    });
  });

  describe('CORS', () => {
    it('un origen permitido recibe cabeceras y el preflight responde 204', async () => {
      const respuesta = await pedir('/api/usuarios', { metodo: 'OPTIONS', cabeceras: { origin: 'http://localhost:4200' } });
      expect(respuesta.status).toBe(204);
      expect(respuesta.headers.get('access-control-allow-origin')).toBe('http://localhost:4200');
    });

    it('un origen no permitido no recibe cabeceras CORS', async () => {
      const respuesta = await pedir('/api/health', { cabeceras: { origin: 'https://malo.example' } });
      expect(respuesta.headers.get('access-control-allow-origin')).toBeNull();
    });
  });

  describe('autenticación', () => {
    it('login correcto devuelve un JWT de 900 segundos', async () => {
      const cuerpo = await json(await pedir('/api/auth/login', { metodo: 'POST', cuerpo: { username: 'admin', password: 'angular' } }));
      expect(cuerpo.tokenType).toBe('Bearer');
      expect(cuerpo.expiresInSeconds).toBe(900);
      expect(cuerpo.accessToken.split('.')).toHaveLength(3);
    });

    it('contraseña incorrecta o usuario inexistente: 401 invalid_credentials', async () => {
      for (const cuerpo of [{ username: 'admin', password: 'otra' }, { username: 'nadie', password: 'angular' }]) {
        const respuesta = await pedir('/api/auth/login', { metodo: 'POST', cuerpo });
        expect(respuesta.status).toBe(401);
        expect((await json(respuesta)).error).toBe('invalid_credentials');
      }
    });

    it('un nombre heredado de Object no inicia sesión', async () => {
      expect((await pedir('/api/auth/login', { metodo: 'POST', cuerpo: { username: 'constructor', password: 'angular' } })).status).toBe(401);
    });

    it('un login sin cuerpo o con el cuerpo «null» es un 401, no un error interno', async () => {
      expect((await pedir('/api/auth/login', { metodo: 'POST' })).status).toBe(401);
      expect((await pedir('/api/auth/login', { metodo: 'POST', raw: 'null' })).status).toBe(401);
    });

    it('el perfil exige token válido y devuelve id, nombre y rol', async () => {
      expect((await pedir('/api/auth/profile')).status).toBe(401);
      expect((await pedir('/api/auth/profile', { token: 'basura' })).status).toBe(401);
      expect(await json(await pedir('/api/auth/profile', { token: admin }))).toEqual({
        id: 'admin-1',
        name: 'Administrador de demostración',
        role: 'admin',
      });
    });
  });

  describe('usuarios: autenticación y autorización', () => {
    it('sin token, 401 en todas las operaciones', async () => {
      expect((await pedir('/api/usuarios')).status).toBe(401);
      expect((await pedir('/api/usuarios', { metodo: 'POST', cuerpo: {} })).status).toBe(401);
      expect((await pedir('/api/usuarios/1')).status).toBe(401);
    });

    it('un alumno puede consultar pero no escribir (403)', async () => {
      expect((await pedir('/api/usuarios', { token: alumno })).status).toBe(200);
      const respuesta = await pedir('/api/usuarios', { metodo: 'POST', token: alumno, cuerpo: { nombre: 'Eva', email: 'eva@example.com', rol: 'alumno' } });
      expect(respuesta.status).toBe(403);
      expect((await json(respuesta)).error).toBe('forbidden');
    });
  });

  describe('usuarios: CRUD como administrador', () => {
    it('listado con 23 usuarios de ejemplo, filtro y paginación en el servidor', async () => {
      const todos = await json(await pedir('/api/usuarios?size=5', { token: admin }));
      expect(todos.total).toBe(23);
      expect(todos.items).toHaveLength(5);
      const filtrado = await json(await pedir('/api/usuarios?q=ana', { token: admin }));
      expect(filtrado.items.every((u) => /ana/i.test(u.nombre + u.email))).toBe(true);
      expect((await json(await pedir('/api/usuarios?size=1000', { token: admin }))).size).toBe(50);
    });

    it('ordena por nombre en sentido descendente (SQLite compara sin mayúsculas solo en ASCII)', async () => {
      const ordenado = await json(await pedir('/api/usuarios?sort=nombre&dir=desc&size=50', { token: admin }));
      const clave = (texto) => texto.replace(/[A-Z]/g, (c) => c.toLowerCase());
      const nombres = ordenado.items.map((u) => clave(u.nombre));
      expect(nombres).toEqual([...nombres].sort().reverse());
    });

    it('una columna de orden desconocida se sustituye por el id (lista blanca, sin SQL inyectado)', async () => {
      expect((await pedir('/api/usuarios?sort=id;DROP%20TABLE%20usuarios', { token: admin })).status).toBe(200);
      expect((await json(await pedir('/api/usuarios?size=1', { token: admin }))).total).toBe(23);
    });

    it('crea (201), lee, edita (200), repite email (409) y borra (204)', async () => {
      const alta = await pedir('/api/usuarios', { metodo: 'POST', token: admin, cuerpo: { nombre: 'Eva Gil', email: 'eva.gil@example.com', rol: 'profesor' } });
      expect(alta.status).toBe(201);
      const creado = await json(alta);
      expect(creado.nombre).toBe('Eva Gil');
      expect((await pedir('/api/usuarios', { metodo: 'POST', token: admin, cuerpo: { nombre: 'Otra', email: 'EVA.GIL@example.com', rol: 'alumno' } })).status).toBe(409);
      expect((await pedir(`/api/usuarios/${creado.id}`, { token: admin })).status).toBe(200);

      const editado = await pedir(`/api/usuarios/${creado.id}`, { metodo: 'PUT', token: admin, cuerpo: { nombre: 'Eva Gil Pérez', email: 'eva.gil@example.com', rol: 'admin' } });
      expect(editado.status).toBe(200);
      expect((await json(editado)).rol).toBe('admin');

      expect((await pedir(`/api/usuarios/${creado.id}`, { metodo: 'DELETE', token: admin })).status).toBe(204);
      expect((await pedir(`/api/usuarios/${creado.id}`, { metodo: 'DELETE', token: admin })).status).toBe(404);
    });

    it('validación: 400 con un mensaje por campo', async () => {
      const respuesta = await pedir('/api/usuarios', { metodo: 'POST', token: admin, cuerpo: { nombre: 'x', email: 'no', rol: 'dios' } });
      expect(respuesta.status).toBe(400);
      const cuerpo = await json(respuesta);
      expect(cuerpo.error).toBe('validation');
      expect(Object.keys(cuerpo.errores).sort()).toEqual(['email', 'nombre', 'rol']);
    });

    it('un cuerpo vacío en una alta se valida como datos ausentes (400)', async () => {
      expect((await pedir('/api/usuarios', { metodo: 'POST', token: admin })).status).toBe(400);
    });

    it('JSON inválido: 400 bad_request', async () => {
      const respuesta = await pedir('/api/usuarios', { metodo: 'POST', token: admin, raw: '{no es json' });
      expect(respuesta.status).toBe(400);
      expect((await json(respuesta)).error).toBe('bad_request');
    });

    it('un cuerpo mayor que el límite se rechaza con 413', async () => {
      const respuesta = await pedir('/api/auth/login', { metodo: 'POST', raw: JSON.stringify({ username: 'a'.repeat(20_000) }) }).catch((error) => error);
      // El servidor corta la lectura y responde 413; según el cliente, la conexión puede cerrarse antes de leer la respuesta.
      if (respuesta instanceof Response) expect(respuesta.status).toBe(413);
      else expect(String(respuesta)).toMatch(/fetch|socket|closed|reset/i);
    });

    it('usuario inexistente: 404 al leer, editar y borrar', async () => {
      expect((await pedir('/api/usuarios/9999', { token: admin })).status).toBe(404);
      expect((await pedir('/api/usuarios/9999', { metodo: 'PUT', token: admin, cuerpo: { nombre: 'Ana', email: 'a@example.com', rol: 'alumno' } })).status).toBe(404);
      expect((await pedir('/api/usuarios/9999', { metodo: 'DELETE', token: admin })).status).toBe(404);
    });
  });

  describe('registro de peticiones (LOG_REQUESTS)', () => {
    it('con LOG_REQUESTS=true cada petición queda registrada con su estado', async () => {
      const log = vi.spyOn(console, 'log').mockImplementation(() => {});
      const app = await arrancar({ env: { LOG_REQUESTS: 'true' } });
      try {
        await fetch(`${app.base}/api/health`);
        expect(log.mock.calls.some(([linea]) => /GET \/api\/health → 200/.test(String(linea)))).toBe(true);
      } finally {
        await app.cerrar();
        log.mockRestore();
      }
    });
  });
});
