import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cargarConfig } from '../src/config/config.mjs';
import { arrancar, tokenDe } from './ayudas.mjs';

const usuariosDe = async (base) => {
  const token = await tokenDe(base, 'admin');
  return (await (await fetch(`${base}/api/usuarios`, { headers: { authorization: `Bearer ${token}` } })).json()).total;
};

describe('configuración', () => {
  it('por defecto: memoria, datos de ejemplo y puerto 3001', () => {
    const config = cargarConfig({ env: {}, argv: [], cwd: '/x' });
    expect(config.baseDeDatos).toEqual({ enMemoria: true, archivo: ':memory:', sembrar: true });
    expect(config.puerto).toBe(3001);
    expect(config.jwt.secretoDeDesarrollo).toBe(true);
  });

  it('DB_FILE define una base en fichero, relativa al directorio de trabajo', () => {
    const config = cargarConfig({ env: { DB_FILE: './backend/data/x.sqlite' }, argv: [], cwd: '/proyecto' });
    expect(config.baseDeDatos.enMemoria).toBe(false);
    expect(config.baseDeDatos.archivo).toBe('/proyecto/backend/data/x.sqlite');
  });

  it(':memory: y una variable de espacios vuelven a la memoria', () => {
    expect(cargarConfig({ env: { DB_FILE: ':memory:' }, argv: [] }).baseDeDatos.enMemoria).toBe(true);
    expect(cargarConfig({ env: { DB_FILE: '   ' }, argv: [] }).baseDeDatos.enMemoria).toBe(true);
  });

  it('un argumento de línea de comandos gana a la variable de entorno', () => {
    const config = cargarConfig({ env: { DB_FILE: ':memory:', PORT: '4000' }, argv: ['--db-file=/tmp/a.sqlite', '--port=5000'], cwd: '/' });
    expect(config.baseDeDatos.archivo).toBe('/tmp/a.sqlite');
    expect(config.puerto).toBe(5000);
  });

  it('DB_SEED=false desactiva los datos de ejemplo; --db-seed=true los reactiva', () => {
    expect(cargarConfig({ env: { DB_SEED: 'false' }, argv: [] }).baseDeDatos.sembrar).toBe(false);
    expect(cargarConfig({ env: { DB_SEED: 'false' }, argv: ['--db-seed=true'] }).baseDeDatos.sembrar).toBe(true);
    expect(cargarConfig({ env: { DB_SEED: '0' }, argv: [] }).baseDeDatos.sembrar).toBe(false);
  });

  it('un JWT_SECRET vacío usa el secreto de desarrollo', () => {
    const config = cargarConfig({ env: { JWT_SECRET: '' }, argv: [] });
    expect(config.jwt.secretoDeDesarrollo).toBe(true);
    expect(config.jwt.secreto).not.toBe('');
  });

  it('CORS_ORIGINS admite varios orígenes separados por comas', () => {
    expect(cargarConfig({ env: { CORS_ORIGINS: 'https://a.example, https://b.example' }, argv: [] }).cors.origenes)
      .toEqual(['https://a.example', 'https://b.example']);
  });

  it('LOG_REQUESTS acepta true, y false por defecto', () => {
    expect(cargarConfig({ env: { LOG_REQUESTS: 'true' }, argv: [] }).registrarPeticiones).toBe(true);
    expect(cargarConfig({ env: {}, argv: [] }).registrarPeticiones).toBe(false);
  });
});

describe('base de datos en memoria y en fichero', () => {
  it('en memoria, cada aplicación nueva empieza con los 23 usuarios de ejemplo', async () => {
    const primera = await arrancar();
    expect(await usuariosDe(primera.base)).toBe(23);
    await primera.cerrar();
    const segunda = await arrancar();
    expect(await usuariosDe(segunda.base)).toBe(23);
    await segunda.cerrar();
  });

  it('en fichero, los datos sobreviven al reinicio y los de ejemplo no se vuelven a cargar', async () => {
    const carpeta = mkdtempSync(join(tmpdir(), 'backend-bd-'));
    const archivo = join(carpeta, 'sub', 'usuarios.sqlite');
    try {
      const primera = await arrancar({ env: { DB_FILE: archivo } });
      const token = await tokenDe(primera.base, 'admin');
      await fetch(`${primera.base}/api/usuarios`, {
        method: 'POST',
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify({ nombre: 'Persistente', email: 'persistente@example.com', rol: 'alumno' }),
      });
      await primera.cerrar();

      const segunda = await arrancar({ env: { DB_FILE: archivo } });
      expect(await usuariosDe(segunda.base)).toBe(24);
      await segunda.cerrar();
    } finally {
      rmSync(carpeta, { recursive: true, force: true });
    }
  });

  it('sin datos de ejemplo, una base nueva está vacía', async () => {
    const app = await arrancar({ env: { DB_SEED: 'false' } });
    expect(await usuariosDe(app.base)).toBe(0);
    await app.cerrar();
  });
});
