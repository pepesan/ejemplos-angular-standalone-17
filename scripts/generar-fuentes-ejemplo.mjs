#!/usr/bin/env node
// Genera src/app/navigation/fuente-ejemplo/fuentes-ejemplo.generated.ts a partir del grafo de imports:
// para cada `data: { fuente }` de las rutas, lista el fichero principal y todo lo que importa dentro de src/app
// (componentes, pipes, directivas, servicios, modelos...), clasificado por tipo. Uso: npm run fuentes
// En los EJEMPLOS DE RUTAS añade además el fichero donde se declaran sus rutas (píldora «Rutas»), aunque ningún
// componente lo importe: el fichero de rutas dedicado (p. ej. `rutas-v2.routes.ts`, `lazy-module.module.ts`) y,
// para los ejemplos de navegación clásicos, `app.routes.ts` (ver EJEMPLOS_EN_APP_ROUTES).
// Con `--check` (npm run fuentes:check) no escribe: sale con código 1 si el fichero generado está desfasado.
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';

const RAIZ = 'src/app';
const SALIDA = 'src/app/navigation/fuente-ejemplo/fuentes-ejemplo.generated.ts';
const EXCLUIDOS = /\.(spec|stories)\.ts$|(^|\/)(enunciado\/enunciado|aviso-api\/aviso-api)\.component\.ts$|(^|\/)app\.routes\.ts$|\.generated\.ts$/;

function ficherosTs(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? ficherosTs(p) : p.endsWith('.ts') ? [p] : [];
  });
}

function resolverImport(desde, espec) {
  if (!espec.startsWith('.')) return null;
  const base = normalize(join(dirname(desde), espec));
  for (const c of [`${base}.ts`, join(base, 'index.ts')]) if (existsSync(c)) return c;
  return null;
}

function importsDe(fichero) {
  const src = readFileSync(fichero, 'utf8');
  const res = [];
  for (const m of src.matchAll(/(?:from\s*|import\s*\(\s*)['"](\.[^'"]+)['"]/g)) {
    const r = resolverImport(fichero, m[1]);
    if (r && !EXCLUIDOS.test(r) && r.startsWith(RAIZ)) res.push(r);
  }
  return res;
}

function tipoDe(fichero) {
  const src = readFileSync(fichero, 'utf8');
  if (fichero.includes('/validators/')) return 'validador';
  if (/@NgModule\s*\(/.test(src)) return 'modulo';
  if (/@Pipe\s*\(/.test(src)) return 'pipe';
  if (/@Directive\s*\(/.test(src)) return 'directiva';
  if (/@Component\s*\(/.test(src)) return fichero.includes('/pages/') ? 'page' : 'componente';
  if (/@Injectable\s*\(/.test(src)) return 'servicio';
  // Un fichero que exporta un array `Routes` es de rutas aunque declare también sus guardas (`rutas-v2.routes.ts`).
  if (/\bRoutes\b/.test(src) && /export const \w+:\s*Routes/.test(src)) return 'rutas';
  if (/:\s*(CanActivateFn|CanMatchFn|CanDeactivateFn|ResolveFn|HttpInterceptorFn)\b/.test(src)) return 'guarda';
  return 'modelo';
}

// Ejemplos de rutas cuyas rutas viven en `app.routes.ts` (el resto de ejemplos de rutas tiene un fichero dedicado).
const FICHERO_APP_ROUTES = 'src/app/app.routes.ts';
const EJEMPLOS_EN_APP_ROUTES = new Set([
  'src/app/pages/navegacion/navegacion.component.ts',
  'src/app/pages/sub-rutas/sub-rutas.component.ts',
  'src/app/pages/child-a/child-a.component.ts',
  'src/app/pages/child-b/child-b.component.ts',
  'src/app/pages/listado/listado.component.ts',
  'src/app/pages/detalle/detalle.component.ts',
]);

// Raíces: todos los `fuente: '...'` declarados en ficheros de rutas. Si el fichero que los declara es un fichero
// de rutas DEDICADO (no `app.routes.ts`, que declara los ejemplos sueltos), se recuerda para añadirlo al ejemplo.
const raices = new Set();
const rutasDedicadas = new Map();
for (const f of ficherosTs(RAIZ)) {
  for (const m of readFileSync(f, 'utf8').matchAll(/fuente:\s*'([^']+)'/g)) {
    raices.add(m[1]);
    if (!EXCLUIDOS.test(f)) rutasDedicadas.set(m[1], f);
  }
}

const mapa = {};
for (const raiz of [...raices].sort()) {
  const vistos = new Set();
  const orden = [];
  const visitar = (f) => {
    if (vistos.has(f)) return;
    vistos.add(f);
    orden.push(f);
    importsDe(f).forEach(visitar);
  };
  visitar(raiz);
  // El fichero de rutas va justo después del principal (el primero siempre es el propio ejemplo).
  const ficheroDeRutas = rutasDedicadas.get(raiz) ?? (EJEMPLOS_EN_APP_ROUTES.has(raiz) ? FICHERO_APP_ROUTES : null);
  if (ficheroDeRutas && !orden.includes(ficheroDeRutas)) orden.splice(1, 0, ficheroDeRutas);
  mapa[raiz] = orden.map((ruta) => ({ ruta, tipo: tipoDe(ruta) }));
}

const cuerpo = JSON.stringify(mapa, null, 2).replace(/"(ruta|tipo)":/g, '$1:').replace(/"/g, "'");
const contenido =
  `// Fichero generado por scripts/generar-fuentes-ejemplo.mjs (npm run fuentes). No editar a mano.\n` +
  `import { ElementoFuente } from './fuente-ejemplo.tipos';\n\n` +
  `export const FUENTES_EJEMPLO: Record<string, ElementoFuente[]> = ${cuerpo};\n`;

if (process.argv.includes('--check')) {
  const actual = existsSync(SALIDA) ? readFileSync(SALIDA, 'utf8') : '';
  if (actual !== contenido) {
    console.error(`${SALIDA} está desfasado. Ejecuta: npm run fuentes`);
    process.exit(1);
  }
  console.log(`${SALIDA} actualizado (${raices.size} ejemplos)`);
} else {
  writeFileSync(SALIDA, contenido);
  console.log(`Generado ${SALIDA}: ${raices.size} ejemplos`);
}
