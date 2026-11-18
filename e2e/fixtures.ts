import { randomUUID } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { expect, test as base } from '@playwright/test';

/**
 * Los tests importan `test` y `expect` de AQUÍ en vez de '@playwright/test'. Si se ejecutan con
 * `COBERTURA_E2E=1` (script `npm run cobertura:e2e`), cada test guarda la cobertura de JavaScript que
 * mide el navegador (V8) en `.cobertura-e2e/raw`; `scripts/cobertura-e2e.mjs` la convierte después en un
 * informe sobre los ficheros fuente de `src/app`. Sin la variable, no cambia nada.
 */
const DIRECTORIO_BRUTO = '.cobertura-e2e/raw';

export const test = base.extend({
  page: async ({ page }, use) => {
    const medir = process.env['COBERTURA_E2E'] === '1';
    if (medir) await page.coverage.startJSCoverage({ resetOnNavigation: false });
    await use(page);
    if (medir) {
      const entradas = await page.coverage.stopJSCoverage();
      mkdirSync(DIRECTORIO_BRUTO, { recursive: true });
      writeFileSync(`${DIRECTORIO_BRUTO}/${randomUUID()}.json`, JSON.stringify(entradas));
    }
  },
});

export { expect };
