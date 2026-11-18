#!/usr/bin/env node
/**
 * Convierte la cobertura de V8 que guardan los tests e2e (`.cobertura-e2e/raw`) en un informe sobre los
 * ficheros fuente de `src/app`, usando los source maps del servidor de desarrollo.
 *
 * Qué mide: el código de la aplicación que se EJECUTA durante los e2e, medido en el navegador real.
 * Limitación: un fichero que ningún e2e llegó a cargar (p. ej. un chunk de carga diferida que no se visita)
 * no aparece en el reparto de sentencias; se lista aparte como «ficheros sin cargar».
 *
 * Uso: `npm run cobertura:e2e` (ejecuta los e2e con medición y llama a este script).
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { convert } from 'ast-v8-to-istanbul';
import { parseAstAsync } from 'vite';

const RAIZ = process.cwd();
const BRUTO = join(RAIZ, '.cobertura-e2e/raw');
const SALIDA = join(RAIZ, '.cobertura-e2e');
const EXCLUIR = /\.(spec|stories|generated)\.ts$|\/testing\//;

if (!existsSync(BRUTO)) {
  console.error('No hay datos: ejecuta antes los e2e con COBERTURA_E2E=1 (npm run cobertura:e2e).');
  process.exit(1);
}

async function mapaFuente(url, codigo) {
  // El comentario del mapa es la ÚLTIMA aparición (el código puede contener ese texto en sus cadenas).
  const i = codigo.lastIndexOf('//# sourceMappingURL=');
  if (i < 0) return undefined;
  const referencia = codigo.slice(i + '//# sourceMappingURL='.length).trim();
  if (referencia.startsWith('data:')) return JSON.parse(Buffer.from(referencia.split(',')[1], 'base64').toString('utf8'));
  const respuesta = await fetch(new URL(referencia, url));
  return respuesta.ok ? respuesta.json() : undefined;
}

const total = {}; // ruta -> cobertura Istanbul acumulada
const cacheMapas = new Map();
let guion = 0;

function sumar(destino, origen) {
  for (const clave of ['s', 'f']) for (const id in origen[clave]) destino[clave][id] = (destino[clave][id] ?? 0) + origen[clave][id];
  for (const id in origen.b) destino.b[id] = origen.b[id].map((n, i) => (destino.b[id]?.[i] ?? 0) + n);
}

for (const fichero of readdirSync(BRUTO).filter((f) => f.endsWith('.json'))) {
  for (const entrada of JSON.parse(readFileSync(join(BRUTO, fichero), 'utf8'))) {
    if (!entrada.url.includes('127.0.0.1:4300') || !entrada.source || !entrada.functions) continue;
    guion++;
    let mapa = cacheMapas.get(entrada.url);
    if (mapa === undefined) {
      mapa = (await mapaFuente(entrada.url, entrada.source).catch(() => undefined)) ?? null;
      cacheMapas.set(entrada.url, mapa);
    }
    if (!mapa) continue;
    let ast;
    try {
      ast = await parseAstAsync(entrada.source);
    } catch {
      continue;
    }
    const mapaIstanbul = await convert({ code: entrada.source, sourceMap: mapa, coverage: { url: pathToFileURL(join(RAIZ, 'servido.js')).href, functions: entrada.functions }, ast });
    for (const [ruta, datos] of Object.entries(mapaIstanbul)) {
      const relativa = relative(RAIZ, resolve(ruta)).replaceAll('\\', '/');
      if (!relativa.startsWith('src/app/') || EXCLUIR.test(relativa)) continue;
      if (!total[relativa]) total[relativa] = structuredClone({ ...datos, s: Object.fromEntries(Object.keys(datos.s).map((k) => [k, 0])), f: Object.fromEntries(Object.keys(datos.f).map((k) => [k, 0])), b: Object.fromEntries(Object.keys(datos.b).map((k) => [k, datos.b[k].map(() => 0)])) });
      sumar(total[relativa], datos);
    }
  }
}

// Resumen: los .ts (comparable con la cobertura unitaria) y las plantillas .html (código que genera Angular
// a partir de ellas) se cuentan por separado.
function resumir(filtro) {
  const acumulado = { s: [0, 0], f: [0, 0], b: [0, 0] };
  const filas = [];
  for (const [ruta, d] of Object.entries(total).filter(([r]) => filtro(r))) {
    const s = Object.values(d.s), f = Object.values(d.f), b = Object.values(d.b).flat();
    const fila = { ruta, s: [s.filter((n) => n > 0).length, s.length], f: [f.filter((n) => n > 0).length, f.length], b: [b.filter((n) => n > 0).length, b.length] };
    filas.push(fila);
    for (const k of ['s', 'f', 'b']) { acumulado[k][0] += fila[k][0]; acumulado[k][1] += fila[k][1]; }
  }
  return { acumulado, filas };
}
const pct = ([a, t]) => (t ? ((a / t) * 100).toFixed(2) : '100.00');
const ts = resumir((r) => r.endsWith('.ts'));
const html = resumir((r) => r.endsWith('.html'));
const acumulado = ts.acumulado;
const filas = ts.filas;

// Ficheros de src/app que ningún e2e llegó a cargar
const todos = [];
(function recorrer(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) recorrer(p);
    else if (p.endsWith('.ts') && !EXCLUIR.test(relative(RAIZ, p).replaceAll('\\', '/')) && !/\.d\.ts$/.test(p)) todos.push(relative(RAIZ, p).replaceAll('\\', '/'));
  }
})(join(RAIZ, 'src/app'));
const sinCargar = todos.filter((r) => !total[r]);
const sinCargarLista = sinCargar;

mkdirSync(SALIDA, { recursive: true });
writeFileSync(join(SALIDA, 'coverage-final.json'), JSON.stringify(total));
writeFileSync(join(SALIDA, 'resumen.json'), JSON.stringify({ sentencias: pct(acumulado.s), ramas: pct(acumulado.b), funciones: pct(acumulado.f), ficherosMedidos: filas.length, ficherosSinCargar: sinCargar.length, ficherosTotales: todos.length, plantillasHtml: { sentencias: pct(html.acumulado.s), ramas: pct(html.acumulado.b), funciones: pct(html.acumulado.f), ficheros: html.filas.length } }, null, 2));

console.log(`\nCobertura de los e2e sobre los .ts de src/app (V8, ${guion} scripts analizados)`);
console.log(`  Sentencias: ${pct(acumulado.s)} % (${acumulado.s[0]}/${acumulado.s[1]})`);
console.log(`  Ramas:      ${pct(acumulado.b)} % (${acumulado.b[0]}/${acumulado.b[1]})`);
console.log(`  Funciones:  ${pct(acumulado.f)} % (${acumulado.f[0]}/${acumulado.f[1]})`);
console.log(`  Ficheros .ts cargados por algún e2e: ${filas.length} de ${todos.length}; sin cargar: ${sinCargar.length}`);
console.log(`Plantillas .html (${html.filas.length} ficheros): sentencias ${pct(html.acumulado.s)} %, ramas ${pct(html.acumulado.b)} %, funciones ${pct(html.acumulado.f)} %`);
console.log('\nFicheros .ts sin cargar por ningún e2e:');
for (const r of sinCargarLista) console.log(`  ${r}`);
console.log('\nMenos cubiertos (sentencias, .ts):');
for (const f of filas.filter((x) => x.s[1] >= 5).sort((a, b) => a.s[0] / a.s[1] - b.s[0] / b.s[1]).slice(0, 10)) console.log(`  ${pct(f.s).padStart(6)} %  ${f.ruta}`);
