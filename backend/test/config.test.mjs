import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { cargarConfig } from '../src/config/config.mjs';
import { arrancar, tokenDe } from './ayudas.mjs';

describe('configuración', () => {
  it('por defecto: base de datos en memoria, con datos de ejemplo y puerto 3001', () => {
    const config = cargarConfig({ env: {}, argv: [], cwd: '/x' });
    assert.equal(config.baseDeDatos.enMemoria, true);
    assert.equal(config.baseDeDatos.archivo, ':memory:');
    assert.equal(config.baseDeDatos.sembrar, true);
    assert.equal(config.puerto, 3001);
    assert.equal(config.jwt.secretoDeDesarrollo, true);
  });

  it('DB_FILE define una base en fichero, relativa al directorio de trabajo', () => {
    const config = cargarConfig({ env: { DB_FILE: './backend/data/x.sqlite' }, argv: [], cwd: '/proyecto' });
    assert.equal(config.baseDeDatos.enMemoria, false);
    assert.equal(config.baseDeDatos.archivo, '/proyecto/backend/data/x.sqlite');
  });

  it(':memory: y una variable vacía vuelven a la memoria', () => {
    assert.equal(cargarConfig({ env: { DB_FILE: ':memory:' }, argv: [] }).baseDeDatos.enMemoria, true);
    assert.equal(cargarConfig({ env: { DB_FILE: '   ' }, argv: [] }).baseDeDatos.enMemoria, true);
  });

  it('el argumento de línea de comandos gana a la variable de entorno', () => {
    const config = cargarConfig({ env: { DB_FILE: ':memory:', PORT: '4000' }, argv: ['--db-file=/tmp/a.sqlite', '--port=5000'], cwd: '/' });
    assert.equal(config.baseDeDatos.archivo, '/tmp/a.sqlite');
    assert.equal(config.puerto, 5000);
  });

  it('DB_SEED=false desactiva los datos de ejemplo, y --db-seed=true los vuelve a activar', () => {
    assert.equal(cargarConfig({ env: { DB_SEED: 'false' }, argv: [] }).baseDeDatos.sembrar, false);
    assert.equal(cargarConfig({ env: { DB_SEED: 'false' }, argv: ['--db-seed=true'] }).baseDeDatos.sembrar, true);
  });

  it('un JWT_SECRET vacío no deja el secreto vacío: usa el de desarrollo', () => {
    const config = cargarConfig({ env: { JWT_SECRET: '' }, argv: [] });
    assert.equal(config.jwt.secretoDeDesarrollo, true);
    assert.notEqual(config.jwt.secreto, '');
  });

  it('CORS_ORIGINS admite varios orígenes separados por comas', () => {
    const config = cargarConfig({ env: { CORS_ORIGINS: 'https://a.example, https://b.example' }, argv: [] });
    assert.deepEqual(config.cors.origenes, ['https://a.example', 'https://b.example']);
  });
});

describe('base de datos en memoria y en fichero', () => {
  it('en memoria, cada aplicación nueva empieza con 23 usuarios de ejemplo', async () => {
    const total = async ({ base }) => {
      const token = await tokenDe(base, 'admin');
      return (await (await fetch(`${base}/api/usuarios`, { headers: { authorization: `Bearer ${token}` } })).json()).total;
    };
    const primera = await arrancar();
    assert.equal(await total(primera), 23);
    await primera.cerrar();
    const segunda = await arrancar();
    assert.equal(await total(segunda), 23, 'una memoria nueva no conserva nada de la anterior');
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
      const t2 = await tokenDe(segunda.base, 'admin');
      const cuerpo = await (await fetch(`${segunda.base}/api/usuarios?q=persistente`, { headers: { authorization: `Bearer ${t2}` } })).json();
      assert.equal(cuerpo.total, 1);
      const total = await (await fetch(`${segunda.base}/api/usuarios`, { headers: { authorization: `Bearer ${t2}` } })).json();
      assert.equal(total.total, 24, 'no se deben volver a sembrar los 23 de ejemplo');
      await segunda.cerrar();
    } finally {
      rmSync(carpeta, { recursive: true, force: true });
    }
  });

  it('sin datos de ejemplo, una base nueva está vacía', async () => {
    const { base, cerrar } = await arrancar({ env: { DB_SEED: 'false' } });
    const token = await tokenDe(base, 'admin');
    const cuerpo = await (await fetch(`${base}/api/usuarios`, { headers: { authorization: `Bearer ${token}` } })).json();
    assert.equal(cuerpo.total, 0);
    await cerrar();
  });
});
