import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { arrancar } from '../server.mjs';
import { cargarConfig } from '../src/config/config.mjs';

const SERVIDOR = fileURLToPath(new URL('../server.mjs', import.meta.url));

describe('arranque del servidor', () => {
  it('arranca en un puerto libre, informa de la base de datos y responde', async () => {
    const lineas = [];
    const config = cargarConfig({ env: { JWT_SECRET: 'secreto-de-pruebas' }, argv: [] });
    const app = await arrancar(config, { puerto: 0, log: (l) => lineas.push(l), warn: () => { throw new Error('no debe avisar'); } });
    try {
      const puerto = app.servidor.address().port;
      expect(lineas.some((l) => l.includes(`http://127.0.0.1:${puerto}`))).toBe(true);
      expect(lineas.some((l) => l.includes('SQLite en memoria'))).toBe(true);
      expect((await (await fetch(`http://127.0.0.1:${puerto}/api/health`)).json()).status).toBe('ok');
    } finally {
      await app.cerrar();
    }
  });

  it('avisa si se usa el secreto de desarrollo e informa de la ruta del fichero', async () => {
    const avisos = [];
    const lineas = [];
    const config = cargarConfig({ env: { DB_FILE: '/tmp/backend-test-arranque/x.sqlite' }, argv: [] });
    const app = await arrancar(config, { puerto: 0, log: (l) => lineas.push(l), warn: (a) => avisos.push(a) });
    await app.cerrar();
    expect(avisos[0]).toMatch(/JWT_SECRET/);
    expect(lineas.some((l) => l.includes('SQLite en fichero') && l.includes('x.sqlite'))).toBe(true);
  });

  it('como proceso responde y se cierra ordenadamente con SIGTERM', async () => {
    const hijo = spawn(process.execPath, [SERVIDOR], {
      env: { PATH: process.env.PATH, PORT: '0', JWT_SECRET: 'secreto-de-pruebas' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    try {
      const puerto = await new Promise((resolver, rechazar) => {
        let acumulado = '';
        hijo.stdout.on('data', (trozo) => {
          acumulado += trozo;
          const m = /http:\/\/127\.0\.0\.1:(\d+)/.exec(acumulado);
          if (m) resolver(Number(m[1]));
        });
        hijo.on('exit', (codigo) => rechazar(new Error(`salió antes de arrancar: ${codigo}`)));
      });
      expect((await fetch(`http://127.0.0.1:${puerto}/api/health`)).status).toBe(200);
      hijo.kill('SIGTERM');
      const [codigo] = await once(hijo, 'exit');
      expect(codigo).toBe(0);
    } finally {
      if (hijo.exitCode === null) hijo.kill('SIGKILL');
    }
  });
});
