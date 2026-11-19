import { defineConfig } from 'vitest/config';

/**
 * Pruebas del backend con Vitest. La cobertura se mide con v8 sobre `backend/src` y `server.mjs`, y el umbral
 * (80 %) hace FALLAR la ejecución si baja: así la cobertura no se erosiona sin que nadie lo note.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['backend/test/**/*.test.mjs'],
    coverage: {
      provider: 'v8',
      include: ['backend/src/**/*.mjs', 'backend/server.mjs'],
      reporter: ['text', 'text-summary'],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
});
