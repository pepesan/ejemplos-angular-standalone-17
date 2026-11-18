#!/usr/bin/env node
// Genera src/app/navigation/fuente-ejemplo/fuentes-ejemplo.generated.ts a partir del grafo de imports:
// para cada `data: { fuente }` de las rutas, lista el fichero principal y todo lo que importa dentro de src/app
// (componentes, pipes, directivas, servicios, modelos...), clasificado por tipo. Uso: npm run fuentes
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';

const RAIZ = 'src/app';
const SALIDA = 'src/app/navigation/fuente-ejemplo/fuentes-ejemplo.generated.ts';
const EXCLUIDOS = /\.(spec|stories)\.ts$|(^|\/)app\.routes\.ts$|\.generated\.ts$/;

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
  if (/:\s*(CanActivateFn|CanMatchFn|CanDeactivateFn|ResolveFn|HttpInterceptorFn)\b/.test(src)) return 'guarda';
  if (/\bRoutes\b/.test(src) && /export const \w+:\s*Routes/.test(src)) return 'rutas';
  return 'modelo';
}

// Raíces: todos los `fuente: '...'` declarados en ficheros de rutas.
const raices = new Set();
for (const f of ficherosTs(RAIZ)) {
  for (const m of readFileSync(f, 'utf8').matchAll(/fuente:\s*'([^']+)'/g)) raices.add(m[1]);
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
  mapa[raiz] = orden.map((ruta) => ({ ruta, tipo: tipoDe(ruta) }));
}

const cuerpo = JSON.stringify(mapa, null, 2).replace(/"(ruta|tipo)":/g, '$1:').replace(/"/g, "'");
writeFileSync(
  SALIDA,
  `// Fichero generado por scripts/generar-fuentes-ejemplo.mjs (npm run fuentes). No editar a mano.\n` +
    `import { ElementoFuente } from './fuente-ejemplo.tipos';\n\n` +
    `export const FUENTES_EJEMPLO: Record<string, ElementoFuente[]> = ${cuerpo};\n`,
);
console.log(`Generado ${SALIDA}: ${raices.size} ejemplos`);
