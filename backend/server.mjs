import { createHmac, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';

const port = Number(process.env.PORT ?? 3001);
const jwtSecret = process.env.JWT_SECRET ?? 'solo-para-demostraciones-locales';
const jwtIssuer = 'angular-course-demo';

const resultados = [
  { nombre: 'Angular', dipu: 8, imagen: '' },
  { nombre: 'TypeScript', dipu: 5, imagen: '' },
  { nombre: 'RxJS', dipu: 3, imagen: '' },
];

const cursos = [
  { id: 1, nombre: 'Angular moderno' },
  { id: 2, nombre: 'Routing y Guards' },
  { id: 3, nombre: 'Servicios HTTP y JWT' },
  { id: 4, nombre: 'Signals y RxJS' },
];

function send(response, status, body) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  });
  response.end(JSON.stringify(body));
}

function encodeBase64Url(value) {
  return Buffer.from(value).toString('base64url');
}

function signToken(payload) {
  const header = encodeBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const claims = encodeBase64Url(JSON.stringify(payload));
  const unsignedToken = `${header}.${claims}`;
  const signature = createHmac('sha256', jwtSecret).update(unsignedToken).digest('base64url');
  return `${unsignedToken}.${signature}`;
}

function verifyToken(token) {
  const [headerPart, claimsPart, signaturePart, extraPart] = token.split('.');
  if (!headerPart || !claimsPart || !signaturePart || extraPart) return null;

  const unsignedToken = `${headerPart}.${claimsPart}`;
  const expected = createHmac('sha256', jwtSecret).update(unsignedToken).digest();
  const received = Buffer.from(signaturePart, 'base64url');
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;

  try {
    const header = JSON.parse(Buffer.from(headerPart, 'base64url').toString('utf8'));
    const claims = JSON.parse(Buffer.from(claimsPart, 'base64url').toString('utf8'));
    if (header.alg !== 'HS256' || claims.iss !== jwtIssuer || claims.exp <= Math.floor(Date.now() / 1000)) return null;
    return claims;
  } catch {
    return null;
  }
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 16_384) throw Object.assign(new Error('El cuerpo supera el límite permitido.'), { status: 413 });
    chunks.push(chunk);
  }
  if (size === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw Object.assign(new Error('El cuerpo debe contener JSON válido.'), { status: 400 });
  }
}

function authenticate(request, response) {
  const authorization = request.headers.authorization ?? '';
  const match = /^Bearer\s+(.+)$/i.exec(authorization);
  const claims = match ? verifyToken(match[1]) : null;
  if (!claims) {
    send(response, 401, { error: 'unauthorized', message: 'Falta un JWT válido o ha caducado.' });
    return null;
  }
  return claims;
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin;
  if (origin === 'http://localhost:4200' || origin === 'http://127.0.0.1:4200') {
    response.setHeader('access-control-allow-origin', origin);
    response.setHeader('access-control-allow-headers', 'content-type, authorization');
    response.setHeader('access-control-allow-methods', 'GET, POST, OPTIONS');
    response.setHeader('vary', 'origin');
  }
  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  try {
    if (request.method === 'GET' && url.pathname === '/api/health') {
      send(response, 200, { status: 'ok' });
      return;
    }
    if (request.method === 'GET' && url.pathname === '/api/resultados') {
      send(response, 200, resultados);
      return;
    }
    if (request.method === 'GET' && url.pathname === '/api/cursos') {
      const query = (url.searchParams.get('q') ?? '').trim().toLocaleLowerCase('es');
      send(response, 200, query ? cursos.filter((curso) => curso.nombre.toLocaleLowerCase('es').includes(query)) : cursos);
      return;
    }
    if (request.method === 'GET' && url.pathname === '/api/demo/error') {
      send(response, 503, { error: 'demo_unavailable', message: 'Error de demostración del servidor.' });
      return;
    }
    if (request.method === 'POST' && url.pathname === '/api/auth/login') {
      const body = await readJson(request);
      if (body.username !== 'alumno' || body.password !== 'angular') {
        send(response, 401, { error: 'invalid_credentials', message: 'Usuario o contraseña incorrectos.' });
        return;
      }
      const now = Math.floor(Date.now() / 1000);
      const accessToken = signToken({
        iss: jwtIssuer,
        sub: 'alumno-1',
        name: 'Alumno de demostración',
        role: 'student',
        iat: now,
        exp: now + 900,
      });
      send(response, 200, { tokenType: 'Bearer', accessToken, expiresInSeconds: 900 });
      return;
    }
    if (request.method === 'GET' && url.pathname === '/api/auth/profile') {
      const claims = authenticate(request, response);
      if (!claims) return;
      send(response, 200, { id: claims.sub, name: claims.name, role: claims.role });
      return;
    }
    const resourceMatch = /^\/api\/recursos\/([\w-]+)$/.exec(url.pathname);
    if (request.method === 'GET' && resourceMatch) {
      send(response, 200, { id: resourceMatch[1], title: `Recurso ${resourceMatch[1]}`, source: 'backend local' });
      return;
    }
    send(response, 404, { error: 'not_found', message: 'No existe ese endpoint de demostración.' });
  } catch (error) {
    send(response, error.status ?? 500, {
      error: error.status ? 'bad_request' : 'internal_error',
      message: error.status ? error.message : 'Error interno del servidor de demostración.',
    });
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Backend didáctico disponible en http://127.0.0.1:${port}`);
  console.log('Usuario demo: alumno / angular');
  if (jwtSecret === 'solo-para-demostraciones-locales') {
    console.warn('JWT_SECRET no está definido; se usa una clave pública solo para desarrollo local.');
  }
});
